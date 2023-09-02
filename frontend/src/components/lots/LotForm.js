import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
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
import FormFile from "../utils/FormFile";
import FormCheck from "../utils/FormCheck";
import DateTimePicker from "../utils/DateTimePicker";
import FormValidationErrMsg from "../utils/FormValidationErrMsg";
import Loading from "../utils/Loading";

const uLotDefaultVals = {
  uLotDescription: "",
  uLotExpiresAt: null,
};

function LotForm({
  inUpdateMode,
  setShowChildAlert,
  setChildAlertMessage,
  oldLot = null,
  setLotUpdating = null,
}) {
  const prefix = inUpdateMode ? "uLot" : "cLot";
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
    getValues,
    control,
  } = useForm(inUpdateMode ? { defaultValues: uLotDefaultVals } : {});
  const { setShowAlert, setAlertMessage } = useContext(AppContext);
  const { getObjectKeys, putObject, deleteObject } = useContext(LotsContext);
  const [oldImageInfo, setOldImageInfo] = useState(null);

  useEffect(() => {
    // setup for updating lot
    if (!inUpdateMode || oldLot === null) {
      return;
    }

    const getOldImageInfo = async () => {
      const keys = await getObjectKeys(oldLot._id);
      const info = {};

      for (const key of keys) {
        const keyChunks = key.split("/");
        const oldImageFilename = keyChunks[keyChunks.length - 1];
        info[uuidv4()] = { key, oldImageFilename };
      }

      setOldImageInfo(info);
    };

    getOldImageInfo();

    /*
      defaultValues are cached, so reset is called to replace
      dummy values supplied when LotForm is first
      rendered with null oldLot
      https://react-hook-form.com/docs/useform#defaultValues

      doesn't use prefix to avoid re-running effect each time
      this component rerenders
    */
    reset({
      uLotDescription: oldLot.description,
      uLotExpiresAt: new Date(oldLot.expiresAt),
    });
  }, [inUpdateMode, oldLot, getObjectKeys, reset]);

  useEffect(() => {
    if (!isSubmitSuccessful) {
      return;
    }

    if (inUpdateMode) {
      reset(uLotDefaultVals);
      setLotUpdating(null);
    } else {
      reset();
    }
  }, [isSubmitSuccessful, inUpdateMode, reset, setLotUpdating]);

  if (inUpdateMode && oldLot === null) {
    return null;
  }

  const submitHandler = async (data, e) => {
    e.preventDefault();

    let lotId;
    const msgs = [];

    try {
      let response;

      if (inUpdateMode) {
        response = await axios.patch(`/lots/${oldLot._id}`, {
          expiresAt: data.uLotExpiresAt.getTime(),
          description: data.uLotDescription,
        });
        msgs.push(`successfully updated lot: ${oldLot.name}`);
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
        msgs.push(`successfully created lot: ${data.cLotName}`);
      }

      lotId = response.data.lotId;
    } catch (error) {
      if (error.response && [401, 400].includes(error.response.status)) {
        setShowAlert(true);
        setAlertMessage(
          error.response.status === 401
            ? "Please sign in again"
            : error.response.data.message
        );
        return;
      }
      throw error;
    }

    // only applicable when inUpdateMode is True
    const deletedFiles = [];

    for (const imgId in data[prefix + "ObjectsToDelete"] || {}) {
      if (!data[prefix + "ObjectsToDelete"][imgId]) {
        continue;
      }

      await deleteObject(oldImageInfo[imgId].key);
      deletedFiles.push(oldImageInfo[imgId].oldImageFilename);
    }

    if (deletedFiles.length > 0) {
      msgs.push(`successfully deleted: ${deletedFiles.join(", ")}`);
    }

    /*
    applicable for both create and update modes
    https://developer.mozilla.org/en-US/docs/Web/API/FileList
    */
    const files = data[prefix + "ObjectsToCreate"];

    for (const file of files) {
      await putObject(file, inUpdateMode ? oldLot._id : lotId);
    }

    if (files.length > 0) {
      msgs.push(
        `successfully uploaded: ${Array.from(files, (file) => file.name).join(
          ", "
        )}`
      );
    }

    msgs.push(
      "please go to the active lots tab and click refresh to see the changes"
    );

    setShowChildAlert(true);
    setChildAlertMessage(msgs);
  };

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
              placeholder: inUpdateMode ? oldLot.name : "dog walk",
              inputOptions: { type: "text" },
              register,
              registerOptions: inUpdateMode ? {} : { required: "required" },
              errors: errors[prefix + "Name"],
              disabled: inUpdateMode ? true : false,
            }}
          />
        </Row>
        <Row className="g-2 p-2">
          <FormInput
            {...{
              name: prefix + "MinPrice",
              label: "min price (dollars)",
              placeholder: inUpdateMode ? oldLot.minPrice : 10,
              inputOptions: { type: "number" },
              register,
              registerOptions: inUpdateMode
                ? {}
                : {
                    required: "required",
                    valueAsNumber: true,
                    validate: isPositive,
                  },
              errors: errors[prefix + "MinPrice"],
              disabled: inUpdateMode ? true : false,
            }}
          />
          <FormInput
            {...{
              name: prefix + "MaxPrice",
              label: "max price (dollars)",
              placeholder: inUpdateMode ? oldLot.maxPrice : 15,
              inputOptions: { type: "number" },
              register,
              registerOptions: inUpdateMode
                ? {}
                : {
                    required: "required",
                    valueAsNumber: true,
                    validate: {
                      isPositive,
                      biggerThanMinPrice: (val) => {
                        return (
                          val >= getValues("cLotMinPrice") ||
                          "must >= min price"
                        );
                      },
                    },
                  },
              errors: errors[prefix + "MaxPrice"],
              disabled: inUpdateMode ? true : false,
            }}
          />
          <FormInput
            {...{
              name: prefix + "Step",
              label: "step (dollars)",
              placeholder: inUpdateMode ? oldLot.step : 1,
              inputOptions: { type: "number" },
              register,
              registerOptions: inUpdateMode
                ? {}
                : {
                    required: "required",
                    valueAsNumber: true,
                    validate: {
                      isPositive,
                      canReachMaxPrice: (val) => {
                        const diff =
                          getValues("cLotMaxPrice") - getValues("cLotMinPrice");
                        return (
                          (val <= diff && diff % val === 0) ||
                          "step(s) must be able to reach max price"
                        );
                      },
                    },
                  },
              errors: errors[prefix + "Step"],
              disabled: inUpdateMode ? true : false,
            }}
          />
        </Row>
        <Row className="g-2 p-2">
          <FormInput
            {...{
              name: prefix + "MaxWait",
              label: "max wait (minutes)",
              placeholder: inUpdateMode ? oldLot.maxWait : 15,
              inputOptions: { type: "number" },
              register,
              registerOptions: inUpdateMode
                ? {}
                : {
                    required: "required",
                    valueAsNumber: true,
                    validate: {
                      isPositive,
                      isInteger,
                      lteADay: (val) => val <= 60 * 24 || "must <= 24 hours",
                    },
                  },
              errors: errors[prefix + "MaxWait"],
              disabled: inUpdateMode ? true : false,
            }}
          />
          <DateTimePicker
            {...{
              label: "expires at",
              control,
              name: prefix + "ExpiresAt",
              errors: errors[prefix + "ExpiresAt"],
              rules: { required: "required" },
            }}
          />
        </Row>
        <Row className="g-2 p-2">
          <FormInput
            {...{
              name: prefix + "Description",
              label: "description",
              placeholder: inUpdateMode
                ? oldLot.description
                : "Mu-Chi will walk your dog for 30 minutes",
              inputOptions: { as: "textarea", style: { height: "100px" } },
              register,
              registerOptions: {
                maxLength: {
                  value: 1000,
                  message: "must <= 1000 characters",
                },
              },
              errors: errors[prefix + "Description"],
            }}
          />
        </Row>
        {inUpdateMode &&
          oldImageInfo &&
          Object.keys(oldImageInfo).length > 0 && (
            <Form.Group
              as={Row}
              className="g-2 p-2"
              controlId={prefix + "ObjectsToDelete"}
            >
              <Form.Label>select images to delete</Form.Label>
              {Object.entries(oldImageInfo).map(([imgId, info]) => {
                return (
                  <FormCheck
                    key={imgId}
                    id={imgId}
                    label={info.oldImageFilename}
                    type="checkbox"
                    register={register}
                    name={`${prefix}ObjectsToDelete.${imgId}`}
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
        <FormValidationErrMsg errors={errors[prefix + "ObjectsToCreate"]} />
        <Row className="g-2 p-2 justify-content-md-center">
          <Col md="auto">
            <Button type="submit" variant="outline-dark">
              {inUpdateMode ? "udpate lot" : "create lot"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );

  return inUpdateMode ? (
    <Modal
      size="lg"
      show={oldLot !== null}
      onHide={() => {
        reset(uLotDefaultVals);
        setLotUpdating(null);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{oldLot.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{!oldImageInfo ? <Loading /> : form}</Modal.Body>
    </Modal>
  ) : (
    form
  );
}

export default LotForm;
