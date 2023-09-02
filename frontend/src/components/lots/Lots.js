import { Navigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { useCognito } from "../../hooks/useCognito";
import { useS3 } from "../../hooks/useS3";
import { useActiveLots } from "../../hooks/lots/useActiveLots";
import { LotsContext } from "../../context/LotsContext";
import Loading from "../utils/Loading";
import ActiveLots from "./ActiveLots";
import CreateLot from "./CreateLot";

function Lots() {
  const cognitoCreds = useCognito();
  /*
  cognitoCreds are fetched asynchronously with useEffect, which means
  it could still be null when useS3() is called.
  */
  const s3Functions = useS3(cognitoCreds || {});
  const { loadingActiveLots, setLoadingActiveLots, activeLots } =
    useActiveLots();

  if (cognitoCreds === null) {
    /*
    a loadingCognitoCreds state was not used because cognitoCreds are
    designed to be fetched only once when the user navigates to /lots
    */
    return <Loading />;
  }

  if ("error" in cognitoCreds) {
    return <Navigate replace to="/account" />;
  }

  return (
    <LotsContext.Provider value={s3Functions}>
      <Tabs
        defaultActiveKey="activeLotsTab"
        id="lotTabs"
        className="mb-3"
        justify
      >
        <Tab eventKey="activeLotsTab" title="active">
          <ActiveLots
            {...{
              loadingActiveLots,
              setLoadingActiveLots,
              activeLots: activeLots,
            }}
          />
        </Tab>
        <Tab eventKey="createLotTab" title="create">
          <CreateLot />
        </Tab>
      </Tabs>
    </LotsContext.Provider>
  );
}

export default Lots;
