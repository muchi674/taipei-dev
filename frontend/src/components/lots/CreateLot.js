import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { AppContext } from "../context/AppContext";
import { useS3 } from "../../hooks/useS3";
import { isPositive, isInteger } from "../../utils/validators";
import FormInput from "../utils/FormInput";
import FormTextArea from "../utils/FormTextArea";
import FormFile from "../utils/FormFile";
import DateTimePicker from "../utils/DateTimePicker";
import Notice from "../utils/Notice";

function CreateLot(cognitoCreds) {
  const { register, getValues, control, handleSubmit } = useForm();
  const { setShowAlert, setAlertMessage } = useContext(AppContext);
  const [showNotice, setShowNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const putObject = useS3(cognitoCreds);
  const onSubmit = async (data) => {
    console.log(`typeof expiresAt: ${typeof data.cLotExpiresAt}`);
    let lotId;

    try {
      const response = await axios.post("/lots", {
        name: data.cLotName,
        minPrice: data.cLotMinPrice,
        maxPrice: data.cLotMaxPrice,
        smallestIncrement: data.cLotSmallestIncrement,
        maxWait: data.cLotMaxWait,
        expiresAt: data.cLotExpiresAt,
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
      for (const file in data.cLotImages) {
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
            <DateTimePicker {...{ control, name: "cLotExpiresAt" }} />
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
        </Form>
      </Container>
    </>
  );
}

export default CreateLot;
