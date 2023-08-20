import { useState } from "react";
import { Navigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import Loading from "../utils/Loading";
import ViewLot from "./ViewLot";
import CreateUpdateLot from "./CreateUpdateLot";

function ActiveLots({ loadingActiveLots, setLoadingActiveLots, activeLots }) {
  const [lotViewing, setLotViewing] = useState(null);
  const [lotUpdating, setLotUpdating] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

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
              setShowView(true);
            }}
          >
            view
          </Button>
          {"  "}
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => {
              setLotUpdating(lot);
              setShowUpdate(true);
            }}
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
      <ViewLot
        {...{
          lot: lotViewing,
          showView,
          setShowView,
        }}
      />
      <CreateUpdateLot
        {...{
          inUpdateMode: true,
          oldLot: lotUpdating,
          showUpdate,
          setShowUpdate,
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
