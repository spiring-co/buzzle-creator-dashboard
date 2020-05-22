import LazyLoadingList from "components/LazyLoadingList";
import React, { useState } from "react";
import { Button, Container, Typography } from "@material-ui/core";
import { Link, useRouteMatch, Redirect } from "react-router-dom";

export default () => {
  let { url } = useRouteMatch();
  const [page, setPageNumber] = useState(1);
  const uri = `${process.env.REACT_APP_API_URL}/creators/Iz2xpU8AKw/videoTemplates`;

  return (
    <Container>
      <Typography variant="h4">Your video templates</Typography>
      <Button
        style={{ marginTop: 20, marginBottom: 20 }}
        color="primary"
        variant="contained"
        children={<Link to={`${url}/add`}
          style={{
            textDecoration: 'none',
            color: 'white',

          }}>
          + Add Template
        </Link>}
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
