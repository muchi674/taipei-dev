import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

function ActiveLots({ activeLots, getActiveLots }) {
  const rows = [];
  for (const lot of activeLots) {
    console.log(lot._id);
    console.log(typeof lot._id);
    rows.push(
      <tr key={lot._id}>
        <td>{lot.name}</td>
        <td>{lot.minPrice}</td>
        <td>{lot.maxPrice}</td>
        <td>{lot.maxWait}</td>
        <td>{new Date(lot.expiresAt).toString()}</td>
        <td>
          <Button variant="outline-success" size="sm">
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
    );
  }

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>
            <Button variant="outline-light" size="sm" onClick={getActiveLots}>
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
