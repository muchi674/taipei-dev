import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function DateTimePicker() {
  const [pickedDate, setPickedDate] = useState(new Date());

  return (
    <DatePicker
      selected={pickedDate}
      onChange={(date) => setPickedDate(date)}
      timeInputLabel="Time:"
      dateFormat="MM/dd/yyyy h:mm aa"
      showTimeInput
    />
  );
}

export default DateTimePicker;
