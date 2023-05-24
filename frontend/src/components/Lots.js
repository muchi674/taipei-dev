import { Navigate } from "react-router-dom";

import { useCognito } from "../hooks/useCognito";
import CreateLot from "./CreateLot";

function Lots() {
  const cognitoResponse = useCognito();

  if ("error" in cognitoResponse) {
    return <Navigate replace to="/account" />;
  }

  return <CreateLot />;
}

export default Lots;
