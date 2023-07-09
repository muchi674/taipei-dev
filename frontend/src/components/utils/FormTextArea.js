import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

function FormTextArea({
  className,
  name,
  label,
  height,
  placeholder,
  register,
  registerOptions,
  inputOptions = {},
}) {
  return (
    <FloatingLabel className={className} controlId={name} label={label}>
      <Form.Control
        as="textarea"
        style={{ height }}
        placeholder={placeholder}
        {...inputOptions}
        {...register(name, registerOptions)}
      />
    </FloatingLabel>
  );
}

export default FormTextArea;
