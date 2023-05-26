import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

function FormInput({ name, label, type, register, options }) {
  return (
    <Col md>
      <FloatingLabel controlId={name} label={label}>
        <Form.Control type={type} {...register(name, options)} />
      </FloatingLabel>
    </Col>
  );
}

export default FormInput;
