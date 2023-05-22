import { useContext, useCallback, useEffect, useMemo } from "react";
import axios from "axios";

import { AppContext } from "../context/AppContext";
import { cancelScheduledSignOut } from "../hooks/useAppSetup";

function useSignInWithGoogle() {
  const {
    isSignedIn,
    setIsSignedIn,
    scheduleSignOut,
    setShowAlert,
    setAlertMessage,
  } = useContext(AppContext);

  const signInWithIDTokenOnBackend = useCallback(
    async (response) => {
      let backendResponse;

      try {
        backendResponse = await axios.post("/users", {
          idToken: response.credential,
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setShowAlert(true);
          setAlertMessage(
            `${error.response.status}. ${error.response.data.message}`
          );
          return;
        }
        throw error;
      }

      const signOutDate = backendResponse.data.signOutDate;
      const succeeded = scheduleSignOut(signOutDate);

      if (!succeeded) {
        setShowAlert(true);
        setAlertMessage("Session expired. Please sign in again.");
        return;
      }

      localStorage.setItem("signOutDate", signOutDate);
      setIsSignedIn(true);
    },
    [setIsSignedIn, scheduleSignOut, setShowAlert, setAlertMessage]
  );

  useMemo(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: signInWithIDTokenOnBackend,
    });
  }, [signInWithIDTokenOnBackend]);

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

  const deleteAccount = useCallback(async () => {
    let response;

    try {
      response = await axios.delete("/users");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setShowAlert(true);
        setAlertMessage(
          `${error.response.status}. ${error.response.data.message}`
        );
        return;
      }
      throw error;
    }

    let googleErrorMessage;
    axios.defaults.headers.post["X-CSRF-Token"] = response.data.csrfToken;
    window.google.accounts.id.revoke(response.data.userId, (revokation) => {
      if (revokation.successful) {
        return;
      }
      googleErrorMessage = `Something went wrong with Google, but your bakiAuctions account was deleted successfully. ${revokation.error}`;
    });
    cancelScheduledSignOut();
    setIsSignedIn(false);
    setShowAlert(true);
    setAlertMessage(googleErrorMessage || "Successfully deleted account");
  }, [setShowAlert, setAlertMessage, setIsSignedIn]);

  return { deleteAccount };
}

export { useSignInWithGoogle };
