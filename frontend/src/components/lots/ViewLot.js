import { useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";
import ListGroup from "react-bootstrap/ListGroup";

import { LotsContext } from "../../context/LotsContext";
import { getDataURLFromImageByteArray } from "../../utils/dataURL";
import Loading from "../utils/Loading";

function ViewLot({ lot, lotBeingViewed, setLotBeingViewed }) {
  const { getObjectKeys, getObject } = useContext(LotsContext);
  const [lotImageURLs, setLotImageURLs] = useState(null);

  useEffect(() => {
    if (lotBeingViewed !== lot._id) {
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
  }, [lotBeingViewed, lot._id, getObjectKeys, getObject]);

  let body;

  if (lotImageURLs === null) {
    body = <Loading />;
  } else {
    body = (
      <>
        <Carousel>
          {lotImageURLs.map((url) => {
            return (
              <Carousel.Item key={uuidv4()}>
                <img className="d-block" src={url} alt={lot.name} />
              </Carousel.Item>
            );
          })}
        </Carousel>
        <ListGroup variant="flush">
          <ListGroup.Item>min price (dollars): {lot.minPrice}</ListGroup.Item>
          <ListGroup.Item>max price (dollars): {lot.maxPrice}</ListGroup.Item>
          <ListGroup.Item>step (dollars): {lot.step}</ListGroup.Item>
          <ListGroup.Item>max wait (minutes): {lot.maxWait}</ListGroup.Item>
          <ListGroup.Item>max wait (minutes): {lot.expiresAt}</ListGroup.Item>
          <ListGroup.Item>
            expires at: {new Date(lot.expiresAt).toString()}
          </ListGroup.Item>
          <ListGroup.Item>
            created at: {new Date(lot.createdAt).toString()}
          </ListGroup.Item>
          <ListGroup.Item>
            description: <p>{lot.description}</p>
          </ListGroup.Item>
        </ListGroup>
      </>
    );
  }

  return (
    <Modal
      size="lg"
      show={lotBeingViewed === lot._id}
      onHide={() => setLotBeingViewed(null)}
    >
      <Modal.Header closeButton>
        <Modal.Title>{lot.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
    </Modal>
  );
}

export default ViewLot;
