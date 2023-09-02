import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import { AppContext } from "../../context/AppContext";
import { LotsContext } from "../../context/LotsContext";
import Loading from "../utils/Loading";
import ChildAlert from "../utils/ChildAlert";
import ViewLot from "./ViewLot";
import LotForm from "./LotForm";

function ActiveLots({ loadingActiveLots, setLoadingActiveLots, activeLots }) {
  const [showChildAlert, setShowChildAlert] = useState(false);
  const [childAlertMessage, setChildAlertMessage] = useState(null);
  const [lotDeleting, setLotDeleting] = useState(null);
  const [lotViewing, setLotViewing] = useState(null);
  const [lotUpdating, setLotUpdating] = useState(null);
  const { setShowAlert, setAlertMessage } = useContext(AppContext);
  const { getObjectKeys, deleteObjects } = useContext(LotsContext);

  useEffect(() => {
    if (lotDeleting === null) {
      return;
    }

    const deleteLot = async () => {
      // delete lot from MongoDB
      try {
        await axios.delete(`/lots/${lotDeleting._id}`);
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
      }

      // delete files associated with lot on s3
      const keys = await getObjectKeys(lotDeleting._id);
      await deleteObjects(keys);

      setShowChildAlert(true);
      setChildAlertMessage(`successfully deleted lot: ${lotDeleting.name}`);
      setLotDeleting(null);
      setLoadingActiveLots(true);
    };

    deleteLot();
  }, [
    getObjectKeys,
    deleteObjects,
    setShowAlert,
    setAlertMessage,
    lotDeleting,
    setLotDeleting,
    setLoadingActiveLots,
  ]);

  if (loadingActiveLots || lotDeleting !== null) {
    return <Loading />;
  }

  if ("error" in activeLots) {
    return <Navigate replace to="/account" />;
  }

  const rows = [];
  for (const lot of activeLots) {
    rows.push(
      <tr key={`${lot._id}Row`}>
        <td>{lot.name}</td>
        <td>{lot.minPrice}</td>
        <td>{lot.maxPrice}</td>
        <td>{lot.maxWait}</td>
        <td>{new Date(lot.expiresAt).toString()}</td>
        <td>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => {
              setLotViewing(lot);
            }}
          >
            view
          </Button>
          {"  "}
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => setLotUpdating(lot)}
          >
            edit
          </Button>
          {"  "}
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setLotDeleting(lot)}
          >
            delete
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <>
      <ChildAlert
        {...{
          color: "success",
          show: showChildAlert,
          setShow: setShowChildAlert,
          message: childAlertMessage,
        }}
      />
      <ViewLot
        {...{
          lot: lotViewing,
          setLotViewing,
        }}
      />
      <LotForm
        {...{
          inUpdateMode: true,
          setShowChildAlert,
          setChildAlertMessage,
          oldLot: lotUpdating,
          setLotUpdating,
        }}
      />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => setLoadingActiveLots(true)}
              >
                refresh
              </Button>
            </th>
            <th>min price</th>
            <th>max price</th>
            <th>max wait</th>
            <th>expires at</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

export default ActiveLots;
