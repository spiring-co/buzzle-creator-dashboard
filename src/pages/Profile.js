import React, { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
export default () => {
  const [image, setImage] = useState("");
  return (
    <Container fluid>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (function (theFile) {
            return function (e) {
              setImage(e.target.result);
            };
          })(file);
          reader.readAsDataURL(file);
        }}
      />
      <Image src={image} />
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>

        <Card.Body>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
      </Card>
    </Container>
  );
};
