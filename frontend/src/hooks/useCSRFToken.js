import { useEffect } from "react";
import axios from "axios";

function useCSRFToken() {
  useEffect(() => {
    const getCSRFToken = async () => {
      const { csrfToken } = await axios.get("/csrfToken");
      axios.defaults.headers.post["X-CSRF-Token"] = csrfToken;
    };
    getCSRFToken();
  }, []);
}

export { useCSRFToken };
