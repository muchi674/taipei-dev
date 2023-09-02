import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import FormValidationErrMsg from "./FormValidationErrMsg";

function FormInput({
  name,
  label,
  placeholder,
  register,
  errors,
  inputOptions = {},
  registerOptions = {},
  disabled = false,
}) {
  const formControl = (
    <Form.Control
      placeholder={placeholder}
      {...register(name, disabled ? { disabled } : registerOptions)}
      {...inputOptions}
    />
  );

  return (
    <Col md>
      {disabled ? (
        <>
          <Form.Label>{label}</Form.Label>
          {formControl}
        </>
      ) : (
        <FloatingLabel controlId={name} label={label}>
          {formControl}
        </FloatingLabel>
      )}
      <FormValidationErrMsg errors={errors} />
    </Col>
  );
}

export default FormInput;
