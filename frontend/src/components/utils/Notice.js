import Alert from "react-bootstrap/Alert";

function Notice({ color, show, setShow, message }) {
  return (
    <Alert
      variant={color}
      dismissible
      show={show}
      onClose={() => setShow(false)}
    >
      {message}
    </Alert>
  );
}

export default Notice;
