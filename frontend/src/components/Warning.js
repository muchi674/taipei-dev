import { useContext } from "react";
import Alert from "react-bootstrap/Alert";

import { AppContext } from "../context/AppContext";

function Warning() {
  const { showAlert, setShowAlert, alertMessage } = useContext(AppContext);

  return (
    <Alert
      variant="danger"
      dismissible
      show={showAlert}
      onClose={() => setShowAlert(false)}
    >
      {alertMessage}
    </Alert>
  );
}

export default Warning;
