import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Button, Box } from "@material-ui/core";
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
export default () => {
  const [templates, setTemplates] = useState([]);
  let { url, path } = useRouteMatch();
  const history = useHistory();
  useEffect(() => {
    const temp = localStorage.getItem("draftTemplates");
    setTemplates(temp ? JSON.parse(temp) : []);
  }, []);
  const handleDelete = (index) => {
    const temp = templates.filter((item, ix) => index !== ix);
    setTemplates(temp);
    localStorage.setItem("draftTemplates", JSON.stringify(temp));
  };
  return (
    <Container>
      <Typography variant="h5">Drafted Templates</Typography>
      {templates.length ? (
        templates.map((data, index) => (
          <Paper style={{ marginTop: 10, padding: 10 }}>
            <Typography variant="h6">{data?.title}</Typography>
            <Typography color="secondary">
              {new Date(data?.draftedAt).toLocaleString()}
            </Typography>
            <Box style={{ marginTop: 10 }}>
              <Button
                onClick={() =>
                  history.push({
                    pathname: `${url.substr(0, url.lastIndexOf("/"))}/add`,
                    state: {
                      draftIndex: index,
                      video: data,
                    },
                  })
                }
                children="EDIT"
                size="small"
                color="primary"
                variant="contained"
              />
              <Button
                onClick={() => handleDelete(index)}
                children="Delete"
                size="small"
                color="secondary"
              />
            </Box>
          </Paper>
        ))
      ) : (
        <Typography color="secondary">No Drafted Template</Typography>
      )}
    </Container>
  );
};
