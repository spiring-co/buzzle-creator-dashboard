import LazyLoadingList from "components/LazyLoadingList";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useRouteMatch } from "react-router-dom";

export default () => {
  let { url } = useRouteMatch();
  const [page, setPageNumber] = useState(1);
  const uri = `${process.env.REACT_APP_API_URL}/creator/sjjsjjjkaaaa/videoTemplates`;

  return (
    <Container>
      <h3 className="mb-3">Your video templates</h3>
      <Button
        className="mb-5"
        as={Link}
        to={`${url}/add`}
        children={"+ Add Template"}
      />

      <LazyLoadingList
        from="templates"
        page={page}
        url={uri}
        size={10}
        setPageNumber={setPageNumber}
        listHeader={["Title", "Description"]}
        listKeys={["title", "description"]}
      />
    </Container>
  );
};
