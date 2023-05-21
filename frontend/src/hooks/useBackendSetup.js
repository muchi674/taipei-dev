import { useEffect, useState, useCallback } from "react";
import axios from "axios";

function useBackendSetup() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const configBackendSetup = async () => {
      /*
      1. get csrf token
      2. determine whether user is signed in
      */
      const response = await axios.post("/csrfToken");

      axios.defaults.headers.post["X-CSRF-Token"] = response.data.csrfToken;

      try {
        await axios.post("/sessions");
        setIsSignedIn(true);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(error.response.data);
          return;
        }
        /*
        backend does not return other 4xx code other than 401.
        Therefore, any other error indicates a backend malfunctioning.
        */
        throw error;
      }
    };

    configBackendSetup();
  }, []);

  const signOut = useCallback(async () => {
    try {
      const response = await axios.delete("/sessions");

      axios.defaults.headers.post["X-CSRF-Token"] = response.data.csrfToken;
      setIsSignedIn(false);
    } catch (error) {
      setIsSignedIn(true);
    }
  }, []);

  return { isSignedIn, setIsSignedIn, signOut };
}

export { useBackendSetup };
