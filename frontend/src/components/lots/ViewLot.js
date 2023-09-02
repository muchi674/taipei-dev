import { useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";
import Table from "react-bootstrap/Table";

import { LotsContext } from "../../context/LotsContext";
import { getDataURLFromImageByteArray } from "../../utils/dataURL";
import Loading from "../utils/Loading";

function ViewLot({ lot, setLotViewing }) {
  const { getObjectKeys, getObject } = useContext(LotsContext);
  const [lotImageURLs, setLotImageURLs] = useState(null);

  useEffect(() => {
    if (lot === null) {
      return;
    }

    const getLotImageURLs = async () => {
      const keys = await getObjectKeys(lot._id);
      const imageURLs = [];

      for (const key of keys) {
        const response = await getObject(key);
        const byteArray = await response.Body.transformToByteArray();
        const url = getDataURLFromImageByteArray(key, byteArray);

        imageURLs.push(url);
      }

      setLotImageURLs(imageURLs);
    };

    getLotImageURLs();
  }, [lot, getObjectKeys, getObject]);

  if (lot === null) {
    return null;
  }

  let body;

  if (lotImageURLs === null) {
    body = <Loading />;
  } else {
    body = (
      <>
        {lotImageURLs.length > 0 && (
          <Carousel>
            {lotImageURLs.map((url) => {
              return (
                <Carousel.Item key={uuidv4()}>
                  <img className="d-block" src={url} alt={lot.name} />
                </Carousel.Item>
              );
            })}
          </Carousel>
        )}
        <Table striped bordered hover variant="dark">
          <tbody>
            <tr>
              <th>min price (dollars):</th>
              <td>{lot.minPrice}</td>
            </tr>
            <tr>
              <th>max price (dollars):</th>
              <td>{lot.maxPrice}</td>
            </tr>
            <tr>
              <th>step (dollars):</th>
              <td>{lot.step}</td>
            </tr>
            <tr>
              <th>max wait (minutes):</th>
              <td>{lot.maxWait}</td>
            </tr>
            <tr>
              <th>expires at:</th>
              <td>{new Date(lot.expiresAt).toString()}</td>
            </tr>
            <tr>
              <th>created at:</th>
              <td>{new Date(lot.createdAt).toString()}</td>
            </tr>
            <tr>
              <th>description:</th>
              <td>
                <p>{lot.description}</p>
              </td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  }

  return (
    <Modal
      size="lg"
      show={lot !== null}
      onHide={() => {
        setLotViewing(null);
        setLotImageURLs(null);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{lot.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
    </Modal>
  );
}

export default ViewLot;
