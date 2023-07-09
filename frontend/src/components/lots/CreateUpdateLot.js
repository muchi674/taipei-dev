import { useContext, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { AppContext } from "../../context/AppContext";
import { LotsContext } from "../../context/LotsContext";
import { isPositive, isInteger } from "../../utils/validators";
import FormInput from "../utils/FormInput";
import FormTextArea from "../utils/FormTextArea";
import FormFile from "../utils/FormFile";
import FormCheck from "../utils/FormCheck";
import DateTimePicker from "../utils/DateTimePicker";
import Notice from "../utils/Notice";
import FormValidationErrMsg from "../utils/FormValidationErrMsg";
import Loading from "../utils/Loading";

function CreateUpdateLot({
  inUpdateMode,
  oldLot = null,
  lotBeingUpdated = null,
  setLotBeingUpdated = null,
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    control,
  } = useForm();
  const { setShowAlert, setAlertMessage } = useContext(AppContext);
  const { getObjectKeys, putObject, deleteObject } = useContext(LotsContext);
  const [showNotice, setShowNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [oldImageInfo, setOldImageInfo] = useState(null);
  const prefix = inUpdateMode ? oldLot._id : "cLot";

  useEffect(() => {
    if (!inUpdateMode) {
      return;
    }

    const getOldImageInfo = async () => {
      const keys = await getObjectKeys(oldLot._id);
      const info = {};

      for (const key of keys) {
        const keyChunks = key.split("/");
        const oldImageFilename = keyChunks[keyChunks.length - 1];
        info[key] = oldImageFilename;
      }

      setOldImageInfo(info);
    };

    getOldImageInfo();
  }, [inUpdateMode, oldLot, getObjectKeys]);

  const submitHandler = useCallback(
    async (data, e) => {
      e.preventDefault();

      let msg = "";

      if ("objectsToDelete" in data) {
        const filenames = [];

        for (const key in data["objectsToDelete"]) {
          await deleteObject(key);
          filenames.push(oldImageInfo[key]);
        }

        msg += `successfully deleted: ${filenames.join(", ")}`;
      }

      let lotId;

      try {
        let response;

        if (inUpdateMode) {
          response = await axios.patch(`/lots/${oldLot._id}`, {
            expiresAt: data[`${oldLot._id}ExpiresAt`].getTime(),
            description: data[`${oldLot._id}Description`],
          });
        } else {
          response = await axios.post("/lots", {
            name: data.cLotName,
            minPrice: data.cLotMinPrice,
            maxPrice: data.cLotMaxPrice,
            step: data.cLotStep,
            maxWait: data.cLotMaxWait,
            expiresAt: data.cLotExpiresAt.getTime(),
            description: data.cLotDescription,
          });
        }

        lotId = response.data.lotId;
      } catch (error) {
        if (error.response) {
          const msg =
            error.response.status === 401
              ? "Please sign in again"
              : error.response.data;
          setShowAlert(true);
          setAlertMessage(msg);
          return;
        }
        throw error;
      }

      for (const file of data[prefix + "ObjectsToCreate"]) {
        await putObject(file, lotId);
      }

      setShowNotice(true);
      setNoticeMessage(
        msg +
          `successfully uploaded: ${Array.from(
            data.cLotImages,
            (file) => file.name
          ).join(", ")}`
      );
    },
    [
      deleteObject,
      inUpdateMode,
      oldImageInfo,
      oldLot,
      prefix,
      putObject,
      setAlertMessage,
      setShowAlert,
    ]
  );

  /*
  abbreviation guide:
  c: create
  lt: less than
  lte: less than or equal to
  gte: greater than or equal to
  */
  const form = (
    <Container className="p-3">
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Row className="g-2 p-2">
          <FormInput
            {...{
              name: prefix + "Name",
              label: "name",
              type: "text",
              placeholder: "dog walk",
              register,
              registerOptions: {
                required: "required",
              },
              errors: errors.cLotName,
              inputOptions: inUpdateMode
                ? { disabled: true, defaultValue: oldLot.name }
                : {},
            }}
          />
        </Row>
        <Row className="g-2 p-2">
          <FormInput
            {...{
              name: prefix + "MinPrice",
              label: "min price (dollars)",
              type: "number",
              placeholder: 10,
              register,
              registerOptions: {
                required: "required",
                valueAsNumber: true,
                validate: isPositive,
              },
              errors: errors.cLotMinPrice,
              inputOptions: inUpdateMode
                ? { disabled: true, defaultValue: oldLot.minPrice }
                : {},
            }}
          />
          <FormInput
            {...{
              name: prefix + "MaxPrice",
              label: "max price (dollars)",
              type: "number",
              placeholder: 15,
              register,
              registerOptions: {
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
              inputOptions: inUpdateMode
                ? { disabled: true, defaultValue: oldLot.maxPrice }
                : {},
            }}
          />
          <FormInput
            {...{
              name: prefix + "Step",
              label: "step (dollars)",
              type: "number",
              placeholder: 1,
              register,
              registerOptions: {
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
              inputOptions: inUpdateMode
                ? { disabled: true, defaultValue: oldLot.step }
                : {},
            }}
          />
        </Row>
        <Row className="g-2 p-2">
          <FormInput
            {...{
              name: prefix + "MaxWait",
              label: "max wait (minutes)",
              type: "number",
              placeholder: 15,
              register,
              registerOptions: {
                required: "required",
                valueAsNumber: true,
                validate: {
                  isPositive,
                  isInteger,
                  lteADay: (val) => val <= 60 * 24 || "must <= 24 hours",
                },
              },
              errors: errors.cLotMaxWait,
              inputOptions: inUpdateMode
                ? { disabled: true, defaultValue: oldLot.maxWait }
                : {},
            }}
          />
          <DateTimePicker
            {...{
              label: "expires at",
              control,
              name: prefix + "ExpiresAt",
              errors: errors.cLotExpiresAt,
              defaultValue: inUpdateMode ? new Date(oldLot.expiresAt) : null,
              rules: { required: "required" },
            }}
          />
        </Row>
        <FormTextArea
          {...{
            className: "g-2 p-2",
            name: prefix + "Description",
            label: "description",
            height: "100px",
            placeholder: "Mu-Chi will walk your dog for 30 minutes",
            register,
            registerOptions: {
              maxLength: {
                value: 1000,
                message: "must <= 1000 characters",
              },
            },
            inputOptions: inUpdateMode
              ? { defaultValue: oldLot.description }
              : {},
          }}
        />
        <FormValidationErrMsg errors={errors.cLotDescription} />
        {inUpdateMode && oldImageInfo && (
          <Form.Group
            as={Row}
            className="g-2 p-2"
            controlId={`${oldLot._id}ObjectsToDelete`}
          >
            <Form.Label>select images to delete</Form.Label>
            {Object.entries(oldImageInfo).map(([key, oldImageFilename]) => {
              return (
                <FormCheck
                  key={key}
                  id={key}
                  label={oldImageFilename}
                  type="checkbox"
                  register={register}
                  /*
                  WARNING:
                  might cause unexpected error if
                  the original filename contains a period '.'
                  */
                  name={`${oldLot._id}ObjectsToDelete.${key}`}
                />
              );
            })}
          </Form.Group>
        )}
        <FormFile
          {...{
            className: "g-2 p-2",
            name: prefix + "ObjectsToCreate",
            label: "images",
            accept: ".png, .jpg, .jpeg",
            multiple: true,
            register,
            registerOptions: {
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
  );

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
      {inUpdateMode ? (
        <Modal
          size="lg"
          show={lotBeingUpdated === oldLot._id}
          onHide={() => setLotBeingUpdated(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{oldLot.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{!oldImageInfo ? <Loading /> : form}</Modal.Body>
        </Modal>
      ) : (
        form
      )}
    </>
  );
}

export default CreateUpdateLot;
