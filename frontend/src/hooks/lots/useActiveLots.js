import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AppContext } from "../../context/AppContext";

function useActiveLots() {
  const { setShowAlert, setAlertMessage } = useContext(AppContext);
  const [activeLots, setActiveLots] = useState(null);
  const [loadingActiveLots, setLoadingActiveLots] = useState(true);
  const getActiveLots = useCallback(async () => {
    let response;

    try {
      response = await axios.get("/lots");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setShowAlert(true);
        setAlertMessage("Please sign in again");
        setActiveLots({
          error: `${error.response.status}. ${error.response.data.message}`,
        });
        return;
      }
      throw error;
    }

    setActiveLots(response.data.data);
    setLoadingActiveLots(false);
  }, [setShowAlert, setAlertMessage]);

  useEffect(() => {
    if (loadingActiveLots) {
      getActiveLots();
    }
  }, [loadingActiveLots, getActiveLots]);

  /*
  activeLots is expected to look something like:
  [{_id: 0, name: "apple", ... }, ...]
  */
  return { loadingActiveLots, setLoadingActiveLots, activeLots };
}

export { useActiveLots };
