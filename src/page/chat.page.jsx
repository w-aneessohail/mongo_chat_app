import { Container, Row, Col } from "react-bootstrap";
import { ContactSidebar } from "../component/contactSidebar.component";
import { ChatMessage } from "../component/chatMessage.component";
import { useEffect, useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import useAxios from "../hooks/useAxios.hook";

const ChatPage = () => {
  const [activeContactId, setActiveContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeContact, setActiveContact] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const usersApi = useAxios();
  const messagesApi = useAxios();
  const sendApi = useAxios();

  useEffect(() => {
    usersApi.fetchData({ url: "/users", method: "GET" });
  }, []);

  useEffect(() => {
    if (usersApi.response && Array.isArray(usersApi.response)) {
      setUsers(usersApi.response);
      if (usersApi.response.length > 0) {
        setCurrentUserId(usersApi.response[0]._id);
        if (!activeContactId) {
          setActiveContactId(
            usersApi.response[1]?._id || usersApi.response[0]._id
          );
        }
      }
    }
  }, [usersApi.response]);

  // Fetch messages when contact changes
  useEffect(() => {
    if (activeContactId) {
      const selected = users.find((u) => u._id === activeContactId);
      setActiveContact(selected);
      messagesApi.fetchData({
        url: `/messages?chatId=${activeContactId}`,
        method: "GET",
      });
    }
  }, [activeContactId, users]);

  useEffect(() => {
    if (messagesApi.response && Array.isArray(messagesApi.response)) {
      const formattedMessages = messagesApi.response.map((msg) => {
        const msgUserId =
          typeof msg.user === "object" ? msg.user._id : msg.user;
        const isSender = msgUserId?.toString() === currentUserId?.toString();

        return {
          id: msg._id,
          text: msg.message,
          sender: isSender ? "user" : "other",
          timestamp: new Date(msg.createdAt),
          user: msg.user,
        };
      });
      setMessages(formattedMessages);
    }
  }, [messagesApi.response, currentUserId]);

  const handleSelectContact = (contactId) => {
    setActiveContactId(contactId);
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const optimisticMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      user: currentUserId,
    };
    setMessages([...messages, optimisticMessage]);
    setInputMessage("");

    try {
      await sendApi.fetchData({
        url: "/send",
        method: "POST",
        data: {
          user: currentUserId,
          chat: activeContactId,
          message: inputMessage,
        },
      });
      // Refresh messages
      messagesApi.fetchData({
        url: `/messages?chatId=${activeContactId}`,
        method: "GET",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column p-0">
      {/* Header */}
      <Row className="bg-primary text-white m-0">
        <Col className="py-3 px-4 d-flex align-items-center justify-content-between">
          <h4 className="mb-0">Chat Application</h4>
          <Form.Select
            value={currentUserId || ""}
            onChange={(e) => setCurrentUserId(e.target.value)}
            style={{ width: "200px" }}
            className="text-dark"
          >
            <option value="">Select Current User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} (Me)
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row className="flex-grow-1 m-0 overflow-hidden">
        {/* Sidebar */}
        <Col xs={12} md={4} lg={3} className="p-0 h-100 d-none d-md-block">
          <ContactSidebar
            contacts={users.filter((u) => u._id !== currentUserId)}
            activeContactId={activeContactId}
            onSelectContact={handleSelectContact}
          />
        </Col>

        {/* Chat Area */}
        <Col xs={12} md={8} lg={9} className="p-0 h-100 d-flex flex-column">
          {/* Chat Header */}
          <div className="border-bottom p-3 bg-white">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3 position-relative"
                style={{ width: "40px", height: "40px" }}
              >
                <span>{activeContact?.name?.charAt(0) || "?"}</span>
              </div>
              <div>
                <h6 className="mb-0">
                  {activeContact?.name || "Select a user"}
                </h6>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-grow-1 overflow-auto p-3"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                text={message.text}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
          </div>

          {/* Input Area */}
          <div className="border-top p-3 bg-white">
            <Form onSubmit={handleSendMessage}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={!activeContactId}
                />
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!activeContactId}
                >
                  Send
                </Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export { ChatPage };
