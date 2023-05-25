import { useForm, Controller } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import FormInput from "../utils/FormInput";
import FormTextArea from "../utils/FormTextArea";
import DateTimePicker from "../utils/DateTimePicker";
import { isPositive, isInteger } from "../../utils/validators";

function CreateLot() {
  const { register, getValues, control, handleSubmit } = useForm();

  /*
  abbreviation guide:
  c: create
  lte: less than or equal to
  */
  return (
    <Container className="p-3">
      <Form>
        <Row className="g-2 p-2">
          <FormInput
            {...{
              name: "cLotName",
              label: "name",
              type: "text",
              register,
              options: {
                required: true,
              },
            }}
          />
        </Row>
        <Row className="g-2 p-2">
          <FormInput
            {...{
              name: "cLotMinPrice",
              label: "min price (dollars)",
              type: "number",
              register,
              options: {
                required: true,
                valueAsNumber: true,
                validate: isPositive,
              },
            }}
          />
          <FormInput
            {...{
              name: "cLotMaxPrice",
              label: "max price (dollars)",
              type: "number",
              register,
              options: {
                required: true,
                valueAsNumber: true,
                validate: {
                  isPositive,
                  biggerThanMinPrice: (val) => {
                    return (
                      val >= getValues("cLotMinPrice") || "must >= min price"
                    );
                  },
                },
              },
            }}
          />
          <FormInput
            {...{
              name: "cLotSmallestIncrement",
              label: "smallest increment (dollars)",
              type: "number",
              register,
              options: {
                required: true,
                valueAsNumber: true,
                validate: {
                  isPositive,
                  canReachMaxPrice: (val) => {
                    const diff =
                      getValues("cLotMaxPrice") - getValues("cLotMinPrice");
                    return val <= diff && diff % val === 0;
                  },
                },
              },
            }}
          />
        </Row>
        <Row className="g-2 p-2">
          <FormInput
            {...{
              name: "cLotMaxWait",
              label: "max wait (minutes)",
              type: "number",
              register,
              options: {
                required: true,
                valueAsNumber: true,
                validate: {
                  isPositive,
                  isInteger,
                  lteADay: (val) => val <= 60 * 24 || "must <= 24 hours",
                },
              },
            }}
          />
          <DateTimePicker control={control} />
        </Row>
        <FormTextArea
          {...{
            className: "g-2 p-2",
            name: "cLotDescription",
            label: "description",
            height: "100px",
            register,
            options: {
              maxLength: {
                value: 1000,
                message: "must <= 1000 characters",
              },
            },
          }}
        />
        <Form.Group controlId="photos" className="g-2 p-2">
          <Form.Label>photos</Form.Label>
          <Form.Control type="file" multiple />
        </Form.Group>
      </Form>
    </Container>
  );
}

export default CreateLot;
