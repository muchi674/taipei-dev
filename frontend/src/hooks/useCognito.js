import { useState, useContext, useEffect } from "react";
import axios from "axios";

import { AppContext } from "../context/AppContext";

function useCognito() {
  const [cognitoCreds, setCognitoCreds] = useState(null);
  const { isDone, setShowAlert, setAlertMessage } = useContext(AppContext);

  useEffect(() => {
    if (!isDone) {
      return;
    }

    const getCognitoCreds = async () => {
      try {
        const response = await axios.post("/users/cognito");
        setCognitoCreds(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setShowAlert(true);
          setAlertMessage("Please sign in again");
          setCognitoCreds({
            error: `${error.response.status}. ${error.response.data.message}`,
          });
          return;
        }
        throw error;
      }
    };

    getCognitoCreds();
  }, [isDone, setShowAlert, setAlertMessage]);

  return cognitoCreds;
}

export { useCognito };
