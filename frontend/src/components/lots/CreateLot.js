import { useState } from "react";

import LotForm from "./LotForm";
import ChildAlert from "../utils/ChildAlert";

function CreateLot() {
  const [showChildAlert, setShowChildAlert] = useState(false);
  const [childAlertMessage, setChildAlertMessage] = useState(null);

  return (
    <>
      <ChildAlert
        {...{
          color: "success",
          show: showChildAlert,
          setShow: setShowChildAlert,
          message: childAlertMessage,
        }}
      />
      <LotForm
        {...{ inUpdateMode: false, setShowChildAlert, setChildAlertMessage }}
      />
    </>
  );
}

export default CreateLot;
