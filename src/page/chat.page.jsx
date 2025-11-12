import { Container, Row, Col } from "react-bootstrap";

const ChatPage = () => {
  return (
    <>
      <Container fluid className="vh-100 d-flex flex-column p-0">
        <Row className="bg-primary text-white m-0">
          <Col className="py-3 px-4">
            <h4 className="mb-0">Chat Application</h4>
          </Col>
        </Row>
        <Row className="flex-grow-1 m-0 overflow-hidden">
          <Col
            xs={12}
            md={4}
            lg={3}
            className="p-0 h-100 d-none d-md-block"
          ></Col>
          <Col xs={12} md={8} lg={9} className="p-0 h-100 d-flex flex-column">
            <div className="border-bottom p-3 bg-white"></div>

            <div
              className="flex-grow-1 overflow-auto p-3"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              {/* {messages.map((message)=>{
                    <ChatMessage
                    key={message.id}
                    text={message.text}
                    sender={message.sender}
                    timestamp={message.timestamp}/>
                })} */}
            </div>

            <div className="border-top p-3 bg-white"></div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export { ChatPage };
