import React from "react";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useSignInWithGoogle } from "../hooks/useSignInWithGoogle";

function SignIn() {
  const [showAlert, setShowAlert, alertMessage] = useSignInWithGoogle();

  return (
    <>
      <Alert
        variant="danger"
        dismissible
        show={showAlert}
        onClose={() => setShowAlert(false)}
      >
        {alertMessage}
      </Alert>
      <Container>
        <Row className="justify-content-md-center">
          <Col id="googleSignInButton" md="auto" />
        </Row>
      </Container>
    </>
  );
}

export default SignIn;
