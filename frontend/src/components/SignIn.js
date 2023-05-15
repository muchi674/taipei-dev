import React, { useCallback, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function SignIn() {
  const credentialResponseHandler = useCallback(async (response) => {
    try {
      const tokenVerificationResponse = await fetch(
        "http://localhost:2000/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential: response.credential }),
        }
      );
      const { userId, token } = await tokenVerificationResponse.json();
      console.log(userId, token);
    } catch {}
  }, []);

  useEffect(() => {
    const google = window.google;
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: credentialResponseHandler,
    });
    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      {
        shape: "pill",
      }
    );
  }, [credentialResponseHandler]);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col id="googleSignInButton" md="auto" />
      </Row>
    </Container>
  );
}

export default SignIn;
