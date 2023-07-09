import { useState } from "react";
import { Navigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import Loading from "../utils/Loading";
import ViewLot from "./ViewLot";
import CreateUpdateLot from "./CreateUpdateLot";

function ActiveLots({ loadingActiveLots, setLoadingActiveLots, activeLots }) {
  const [lotBeingViewed, setLotBeingViewed] = useState(null);
  const [lotBeingUpdated, setLotBeingUpdated] = useState(null);

  if (loadingActiveLots) {
    return <Loading />;
  }

  if ("error" in activeLots) {
    return <Navigate replace to="/account" />;
  }

  const rows = [];
  const views = [];
  const updates = [];
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
            onClick={() => setLotBeingViewed(lot._id)}
          >
            view
          </Button>
          {"  "}
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => setLotBeingUpdated(lot._id)}
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
    views.push(
      <ViewLot
        {...{
          key: `${lot._id}View`,
          lot,
          lotBeingViewed,
          setLotBeingViewed,
        }}
      />
    );
    updates.push(
      <CreateUpdateLot
        {...{
          key: `${lot._id}Update`,
          inUpdateMode: true,
          oldLot: lot,
          lotBeingUpdated,
          setLotBeingUpdated,
        }}
      />
    );
  }

  return (
    <>
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
      {views}
      {updates}
    </>
  );
}

export default ActiveLots;
