import React, { useCallback, useEffect } from "react";
import Stack from "react-bootstrap/Stack";

function SignIn() {
  const credentialResponseHandler = useCallback((response) => {
    console.log("Encoded JWT ID token: " + response.credential);
  }, []);

  useEffect(() => {
    const google = window.google;
    google.accounts.id.initialize({
      client_id:
        "200400789328-1s3ira698sa9s2p3mqpu0semd368haq9.apps.googleusercontent.com",
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
    <Stack gap={2} className="col-md-5 mx-auto">
      <div id="googleSignInButton"></div>
    </Stack>
  );
}

export default SignIn;
