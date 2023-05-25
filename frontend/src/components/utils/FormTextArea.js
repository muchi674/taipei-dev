import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

function FormTextArea({
  className,
  name,
  label,
  height,
  register,
  options = {},
}) {
  return (
    <FloatingLabel className={className} controlId={name} label={label}>
      <Form.Control
        as="textarea"
        style={{ height }}
        {...register(name, options)}
      />
    </FloatingLabel>
  );
}

export default FormTextArea;
