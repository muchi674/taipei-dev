import { Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import { useCognito } from "../../hooks/useCognito";
import CreateLot from "./CreateLot";

function Lots() {
  const cognitoCreds = useCognito();

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

  if ("error" in cognitoCreds) {
    return <Navigate replace to="/account" />;
  }

  return <CreateLot />;
}

export default Lots;
