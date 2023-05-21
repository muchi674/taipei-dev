import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

import { AuthContext } from "../context/AuthContext";

function useSignInWithGoogle() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const verifyIDTokenOnBackend = useCallback(
    async (response) => {
      try {
        await axios.post("/users", { idToken: response.credential });
        setIsSignedIn(true);
      } catch (error) {
        setIsSignedIn(false);
        setShowAlert(true);
        setAlertMessage(
          `${error.response.status}. ${error.response.data.message}`
        );
      }
    },
    [setIsSignedIn] // a useState set function that doesn't change
  );

  useMemo(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: verifyIDTokenOnBackend,
    });
  }, [verifyIDTokenOnBackend]);

  useEffect(() => {
    if (!isSignedIn) {
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        {
          shape: "pill",
        }
      );
    }
  }, [isSignedIn]);

  return [showAlert, setShowAlert, alertMessage];
}

export { useSignInWithGoogle };
