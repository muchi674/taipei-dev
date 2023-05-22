import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { AppContext } from "../context/AppContext";
import { useSignInWithGoogle } from "../hooks/useSignInWithGoogle";

function Account() {
  const { isSignedIn, signOut } = useContext(AppContext);
  const { deleteAccount } = useSignInWithGoogle();

  return (
    <Container className="p-3">
      <Row className="justify-content-md-center">
        {!isSignedIn && <Col id="googleSignInButton" md="auto" />}
        {isSignedIn && (
          <Button variant="outline-secondary" onClick={signOut}>
            Sign Out
          </Button>
        )}
      </Row>
      {isSignedIn && (
        <Row className="justify-content-md-center">
          <Button variant="outline-danger" onClick={deleteAccount}>
            Delete Account
          </Button>
        </Row>
      )}
    </Container>
  );
}

export default Account;
