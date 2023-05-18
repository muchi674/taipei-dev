import { useEffect } from "react";
import axios from "axios";

function useCSRFToken() {
  useEffect(() => {
    const getCSRFToken = async () => {
      const response = await axios.get("/csrfToken");
      axios.defaults.headers.post["X-CSRF-Token"] = response.data.csrfToken;
    };
    getCSRFToken();
  }, []);
}

export { useCSRFToken };
