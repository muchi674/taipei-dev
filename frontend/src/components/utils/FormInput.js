import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import FormValidationErrMsg from "./FormValidationErrMsg";

function FormInput({
  name,
  label,
  type,
  placeholder,
  register,
  registerOptions,
  errors,
  inputOptions = {},
}) {
  return (
    <Col md>
      <FloatingLabel controlId={name} label={label}>
        <Form.Control
          type={type}
          placeholder={placeholder}
          {...inputOptions}
          {...register(name, registerOptions)}
        />
      </FloatingLabel>
      <FormValidationErrMsg errors={errors} />
    </Col>
  );
}

export default FormInput;
