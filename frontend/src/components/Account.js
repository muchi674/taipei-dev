import { useContext } from "react";
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
      <Row className="justify-content-center">
        {!isSignedIn && (
          <Col id="googleSignInButton" xs="auto" sm="auto" md="auto" />
        )}
        {isSignedIn && (
          <Col xs="auto" sm="auto" md="auto">
            <Button variant="outline-secondary" onClick={signOut}>
              Sign Out
            </Button>
          </Col>
        )}
      </Row>
      {isSignedIn && (
        <Row className="p-3 justify-content-center">
          <Col xs="auto" sm="auto" md="auto">
            <Button variant="outline-danger" onClick={deleteAccount}>
              Delete Account
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Account;
