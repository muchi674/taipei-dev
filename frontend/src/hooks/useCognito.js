import { useContext, useMemo } from "react";
import axios from "axios";

import { AppContext } from "../context/AppContext";

async function useCognito() {
  const { setShowAlert, setAlertMessage } = useContext(AppContext);

  const credentials = useMemo(async () => {
    try {
      const response = await axios.post("/users/cognito");
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setShowAlert(true);
        setAlertMessage("Please sign in again");
        return {
          error: `${error.response.status}. ${error.response.data.message}`,
        };
      }
      throw error;
    }
  }, [setShowAlert, setAlertMessage]);

  return credentials;
}

export { useCognito };
