import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import Loading from "../utils/Loading";
import ViewLot from "./ViewLot";

function ActiveLots({ loadingActiveLots, setLoadingActiveLots, activeLots }) {
  const [showView, setShowView] = useState(false);

  if (loadingActiveLots) {
    return <Loading />;
  }

  const rows = [];
  for (const lot of activeLots) {
    rows.push(
      <>
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
              onClick={() => setShowView(true)}
            >
              view
            </Button>
            {"  "}
            <Button variant="outline-warning" size="sm">
              edit
            </Button>
            {"  "}
            <Button variant="outline-danger" size="sm">
              delete
            </Button>
          </td>
        </tr>
        <ViewLot {...{ key: `${lot._id}View`, lot, showView, setShowView }} />
      </>
    );
  }

  return (
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
  );
}

export default ActiveLots;
