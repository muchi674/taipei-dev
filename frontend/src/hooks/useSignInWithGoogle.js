import { useCallback, useEffect, useState } from "react";
import axios from "axios";

function useSignInWithGoogle() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const credentialResponseHandler = useCallback(async (response) => {
    try {
      await axios.post("/users", { credential: response.credential });
    } catch (error) {
      setShowAlert(true);
      setAlertMessage(
        `${error.response.status}. ${error.response.data.message}`
      );
    }
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

  return [showAlert, setShowAlert, alertMessage];
}

export { useSignInWithGoogle };
