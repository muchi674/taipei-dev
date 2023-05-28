import { Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { useCognito } from "../../hooks/useCognito";
import { useActiveLots } from "../../hooks/lots/useActiveLots";
import ActiveLots from "./ActiveLots";
import CreateLot from "./CreateLot";

function Lots() {
  const cognitoCreds = useCognito();
  const { activeLots, getActiveLots } = useActiveLots();

  if (cognitoCreds === null) {
    return (
      <>
        <Container className="p-3">
          <Row className="justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Row>
        </Container>
      </>
    );
  }

  if ([cognitoCreds, activeLots].some((element) => "error" in element)) {
    return <Navigate replace to="/account" />;
  }

  return (
    <Tabs
      defaultActiveKey="activeLotsTab"
      id="lotTabs"
      className="mb-3"
      justify
    >
      <Tab eventKey="activeLotsTab" title="active">
        <ActiveLots
          activeLots={activeLots.data}
          getActiveLots={getActiveLots}
        />
      </Tab>
      <Tab eventKey="createLotTab" title="create">
        <CreateLot cognitoCreds={cognitoCreds} />
      </Tab>
    </Tabs>
  );
}

export default Lots;
