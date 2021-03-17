import React from "react";
import { useParams } from "react-router-dom";
import { User, Creator } from "services/api";

import { Container, Typography, Card, CardContent } from "@material-ui/core";

export default () => {
  const { id } = useParams();
  const [creator, setCreator] = React.useState(null);

  React.useEffect(() => {
    User.get(id).then(setCreator);
  }, []);
  React.useEffect(() => {
    console.log(creator);
  }, [creator]);

  if (!creator) return <div />;

  return (
    <Container>
      <Card>
        <CardContent>
          <div style={styles.container}>
            <img
              style={styles.avatar}
              src={
                creator.imageUrl ||
                "https://i2.wp.com/airlinkflight.org/wp-content/uploads/2019/02/male-placeholder-image.jpeg?ssl=1"
              }
            />
            <div style={styles.details}>
              <Typography variant="h5">{creator.name}</Typography>
              <Typography>{creator.email}</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

const styles = {
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "100%",
    objectFit: "cover",
    margin: 8,
  },
  details: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  container: {
    display: "flex",
  },
};
