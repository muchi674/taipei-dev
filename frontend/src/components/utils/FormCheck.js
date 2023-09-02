import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

function FormCheck({ id, label, type, register, name }) {
  return (
    <Col md>
      <Form.Check id={id} label={label} type={type} {...register(name)} />
    </Col>
  );
}

export default FormCheck;
