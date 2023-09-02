import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import bakiImage from "../images/baki.jpg";

function Explore() {
  return (
    <Container className="p-3">
      <Image src={bakiImage} rounded width="680" height="700" />
    </Container>
  );
}

export default Explore;
