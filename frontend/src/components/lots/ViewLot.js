import { useContext, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";

import { LotsContext } from "../../context/LotsContext";

function ViewLot({ lot, showView, setShowView }) {
  const { getObjectURLs } = useContext(LotsContext);
  const [lotImageURLs, setLotImageURLs] = useState([]);

  useEffect(() => {
    const getLotImageURLs = async () => {
      const lotImageURLs = await getObjectURLs(lot._id);

      setLotImageURLs(lotImageURLs);
    };

    getLotImageURLs();
  }, [lot._id, getObjectURLs]);

  const slides = [];

  for (const url of lotImageURLs) {
    slides.push(
      <Carousel.Item key={url}>
        <img className="d-block" src={url} alt="a slide" />
      </Carousel.Item>
    );
  }

  return (
    <Modal size="lg" show={showView} onHide={() => setShowView(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel>{slides}</Carousel>
      </Modal.Body>
    </Modal>
  );
}

export default ViewLot;
