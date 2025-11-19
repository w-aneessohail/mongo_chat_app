import { ListGroup, Form } from "react-bootstrap";

export function ContactSidebar({ contacts, activeContactId, onSelectContact }) {
  return (
    <div className="h-100 d-flex flex-column border-end">
      {/* Search */}
      <div className="p-3 border-bottom">
        <Form.Control
          type="search"
          placeholder="Search contacts..."
          size="sm"
        />
      </div>

      {/* Contacts List */}
      <div className="flex-grow-1 overflow-auto">
        <ListGroup variant="flush">
          {contacts &&
            contacts.map((contact) => (
              <ListGroup.Item
                key={contact._id}
                action
                active={contact._id === activeContactId}
                onClick={() => onSelectContact(contact._id)}
                className="border-0 px-3 py-3"
              >
                <div className="d-flex align-items-center">
                  {/* Avatar */}
                  <div
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <span>{contact.name.charAt(0)}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{contact.name}</h6>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </div>
    </div>
  );
}
