import React, { useContext } from "react";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { AuthContext } from "../context/AuthContext";
import { useSignInWithGoogle } from "../hooks/useSignInWithGoogle";

function Account() {
  const { isSignedIn, signOut } = useContext(AuthContext);
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
      <Container className="p-3">
        <Row className="justify-content-md-center">
          {!isSignedIn && <Col id="googleSignInButton" md="auto" />}
          {isSignedIn && (
            <Button variant="outline-dark" onClick={signOut}>
              Sign Out
            </Button>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Account;
