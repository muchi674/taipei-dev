import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import Col from "react-bootstrap/Col";
import "react-datepicker/dist/react-datepicker.css";

import FormValidationErrMsg from "./FormValidationErrMsg";

function DateTimePicker({
  label,
  control,
  name,
  errors,
  defaultValue = null,
  rules = null,
}) {
  return (
    <Col md>
      <div>{label}</div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            placeholderText="select date and time"
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          />
        )}
        defaultValue={defaultValue}
        {...(rules && { rules })}
      />
      <FormValidationErrMsg errors={errors} />
    </Col>
  );
}

export default DateTimePicker;
