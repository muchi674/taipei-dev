import { v4 as uuidv4 } from "uuid";
import Alert from "react-bootstrap/Alert";

function ChildAlert({ color, show, setShow, message }) {
  return (
    <Alert
      variant={color}
      dismissible
      show={show}
      onClose={() => setShow(false)}
    >
      {Array.isArray(message) && message.length > 1 ? (
        <ul>
          {message.map((msg) => (
            <li key={uuidv4()}>{msg}</li>
          ))}
        </ul>
      ) : (
        message
      )}
    </Alert>
  );
}

export default ChildAlert;
