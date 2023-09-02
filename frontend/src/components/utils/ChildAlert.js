import { v4 as uuidv4 } from "uuid";
import Alert from "react-bootstrap/Alert";

function ChildAlert({ color, show, setShow, message }) {
  if (!message) {
    // would be a problem if 0 is the intended message
    return null;
  }

  let body;

  if (Array.isArray(message)) {
    switch (message.length) {
      case 0:
        return null;
      case 1:
        body = message[0];
        break;
      default:
        body = (
          <ol>
            {message.map((msg) => (
              <li key={uuidv4()}>{msg}</li>
            ))}
          </ol>
        );
    }
  } else {
    body = message;
  }

  return (
    <Alert
      variant={color}
      dismissible
      show={show}
      onClose={() => setShow(false)}
    >
      {body}
    </Alert>
  );
}

export default ChildAlert;
