import { useState } from "react";
import { Navigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import Loading from "../utils/Loading";
import ChildAlert from "../utils/ChildAlert";
import ViewLot from "./ViewLot";
import LotForm from "./LotForm";

function ActiveLots({ loadingActiveLots, setLoadingActiveLots, activeLots }) {
  const [showChildAlert, setShowChildAlert] = useState(false);
  const [childAlertMessage, setChildAlertMessage] = useState(null);
  const [lotViewing, setLotViewing] = useState(null);
  const [lotUpdating, setLotUpdating] = useState(null);

  if (loadingActiveLots) {
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
          <Button variant="outline-danger" size="sm">
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
