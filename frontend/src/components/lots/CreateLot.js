import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { AppContext } from "../../context/AppContext";
import { useS3 } from "../../hooks/useS3";
import { isPositive, isInteger } from "../../utils/validators";
import FormInput from "../utils/FormInput";
import FormTextArea from "../utils/FormTextArea";
import FormFile from "../utils/FormFile";
import DateTimePicker from "../utils/DateTimePicker";
import Notice from "../utils/Notice";
import FormValidationErrMsg from "../utils/FormValidationErrMsg";

function CreateLot({ cognitoCreds }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    control,
  } = useForm();
  const { setShowAlert, setAlertMessage } = useContext(AppContext);
  const [showNotice, setShowNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const putObject = useS3(cognitoCreds);
  const onSubmit = async (data) => {
    let lotId;

    try {
      const response = await axios.post("/lots", {
        name: data.cLotName,
        minPrice: data.cLotMinPrice,
        maxPrice: data.cLotMaxPrice,
        step: data.cLotStep,
        maxWait: data.cLotMaxWait,
        expiresAt: data.cLotExpiresAt.getTime(),
        description: data.cLotDescription,
      });

      lotId = response.data.lotId;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setShowAlert(true);
        setAlertMessage("Please sign in again");
        return;
      }
      throw error;
    }

    try {
      for (const file of data.cLotImages) {
        await putObject(file, lotId);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setShowNotice(true);
    setNoticeMessage(
      "successfully uploaded: " +
        Array.from(data.cLotImages, (file) => file.name).join(", ")
    );
  };

  /*
  abbreviation guide:
  c: create
  lt: less than
  lte: less than or equal to
  */
  return (
    <>
      <Notice
        {...{
          color: "success",
          show: showNotice,
          setShow: setShowNotice,
          message: noticeMessage,
        }}
      />
      <Container className="p-3">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-2 p-2">
            <FormInput
              {...{
                name: "cLotName",
                label: "name",
                type: "text",
                register,
                options: {
                  required: "required",
                },
                errors: errors.cLotName,
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
                  required: "required",
                  valueAsNumber: true,
                  validate: isPositive,
                },
                errors: errors.cLotMinPrice,
              }}
            />
            <FormInput
              {...{
                name: "cLotMaxPrice",
                label: "max price (dollars)",
                type: "number",
                register,
                options: {
                  required: "required",
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
                errors: errors.cLotMaxPrice,
              }}
            />
            <FormInput
              {...{
                name: "cLotStep",
                label: "step (dollars)",
                type: "number",
                register,
                options: {
                  required: "required",
                  valueAsNumber: true,
                  validate: {
                    isPositive,
                    canReachMaxPrice: (val) => {
                      const diff =
                        getValues("cLotMaxPrice") - getValues("cLotMinPrice");
                      console.log(diff % val);
                      return (
                        (val <= diff && diff % val === 0) ||
                        "step(s) must be able to reach max price"
                      );
                    },
                  },
                },
                errors: errors.cLotStep,
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
                  required: "required",
                  valueAsNumber: true,
                  validate: {
                    isPositive,
                    isInteger,
                    lteADay: (val) => val <= 60 * 24 || "must <= 24 hours",
                  },
                },
                errors: errors.cLotMaxWait,
              }}
            />
            <DateTimePicker
              {...{
                control,
                name: "cLotExpiresAt",
                errors: errors.cLotExpiresAt,
              }}
            />
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
          <FormValidationErrMsg errors={errors.cLotDescription} />
          <FormFile
            {...{
              className: "g-2 p-2",
              name: "cLotImages",
              label: "images",
              accept: "image/*",
              multiple: true,
              register,
              options: {
                validate: {
                  lt5InTotal: (files) =>
                    files.length <= 5 || "num images must <= 5",
                  eachLT2MB: (files) => {
                    return (
                      Array.from(files).every((file) => file.size <= 2000000) ||
                      "each image must <= 2 MB"
                    );
                  },
                },
              },
            }}
          />
          <FormValidationErrMsg errors={errors.cLotImages} />
          <Row className="g-2 p-2 justify-content-md-center">
            <Col md="auto">
              <Button type="submit" variant="outline-dark">
                create lot
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export default CreateLot;
