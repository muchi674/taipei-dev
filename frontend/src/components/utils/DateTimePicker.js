import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import Col from "react-bootstrap/Col";

function DateTimePicker({ control }) {
  return (
    <Col md>
      <Controller
        control={control}
        name="date-input"
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
      />
    </Col>
  );
}

export default DateTimePicker;
