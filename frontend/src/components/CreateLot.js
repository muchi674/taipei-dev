import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import DateTimePicker from "./DateTimePicker";

function CreateLot() {
  return (
    <Container className="p-3">
      <Row className="g-2 p-2">
        <Col md>
          <FloatingLabel controlId="name" label="name">
            <Form.Control type="text" />
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="g-2 p-2">
        <Col md>
          <FloatingLabel controlId="minPrice" label="min price in dollars">
            <Form.Control type="number" />
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel controlId="maxPrice" label="max price in dollars">
            <Form.Control type="number" />
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel
            controlId="smallestIncrement"
            label="smallest increment in dollars"
          >
            <Form.Control type="number" />
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="g-2 p-2">
        <Col md>
          <FloatingLabel controlId="maxWait" label="max wait in minute(s)">
            <Form.Control type="number" />
          </FloatingLabel>
        </Col>
        <Col>
          Expires At
          <DateTimePicker />
        </Col>
      </Row>
      <FloatingLabel
        className="g-2 p-2"
        controlId="description"
        label="describe the item you are auctioning"
      >
        <Form.Control as="textarea" style={{ height: "100px" }} />
      </FloatingLabel>
      <Form.Group controlId="photos" className="g-2 p-2">
        <Form.Label>photos</Form.Label>
        <Form.Control type="file" multiple />
      </Form.Group>
    </Container>
  );
}

export default CreateLot;
