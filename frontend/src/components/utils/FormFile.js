import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function FormFile({
  className,
  name,
  label,
  accept,
  multiple,
  register,
  options,
}) {
  return (
    <Form.Group as={Row} className={className} controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="file"
        accept={accept}
        multiple={multiple}
        {...register(name, options)}
      />
    </Form.Group>
  );
}

export default FormFile;
