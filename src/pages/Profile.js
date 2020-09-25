import {
  Box,
  Button,
  Container,
  Divider, Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { Alert } from "@material-ui/lab";
import { Job, VideoTemplate, Creator } from "services/api";
import upload from "services/s3Upload";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import EditIcon from '@material-ui/icons/Edit';
import { useAuth } from "services/auth";
import VerticalTabs from "components/VerticalTabs"
import ChangePassword from "pages/ChangePassword"
function ProfileEdit({ creator }) {
  console.log(creator)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const handleUpdate = (data) => {
    Creator.update(creator?.id, data);
    console.log("to submit", data);
  };
  const { handleChange, values, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      name: creator.name,
      email: creator.email,
      imageUrl: creator?.imageUrl
    },
    validationSchema: null,
    onSubmit: handleUpdate,
  });

  const handleUpload = async (file, extension) => {
    try {
      setLoading(true);
      const task = upload(
        `avtars/${Date.now()}${extension}`,
        file
      );
      task.on("httpUploadProgress", ({ loaded, total }) =>
        setProgress(parseInt((loaded * 100) / total))
      );
      const { Location: uri } = await task.promise();
      setLoading(false);
      setFieldValue('imageUrl', uri);
      console.log(uri)
    } catch (err) {
      setLoading(false);
    }

  }
  return (
    <form onSubmit={handleSubmit}>
      <Container style={{ padding: 15, }}>
        <Typography variant="h5">Profile</Typography>
      </Container>
      <Divider />
      <Box p={2}>
        <Box style={{ marginBottom: 20 }} display="flex" flexDirection="column">
          <Box style={{
            height: 180, width: 180, margin: 10, borderRadius: '50%', alignSelf: 'flex-start',
            border: '1px solid #f0f8ff', position: 'relative', background: '#f0f8ff',
          }}>
            {values?.imageUrl && <img style={{ width: "inherit", height: 'inherit', borderRadius: 'inherit' }} src={values?.imageUrl} />}
            <Paper style={{
              position: 'absolute',
              left: 5, bottom: 15, paddingLeft: 15, paddingRight: 15, borderRadius: 15
            }}>
              <label><EditIcon fontSize="small" /> {loading ? `Uploading : ${progress}%` : "Edit"}
                {!loading && <input
                  style={{ display: 'none' }}
                  onChange={({ target: { files } }) =>
                    handleUpload(files[0], files[0].name.substr(files[0].name.lastIndexOf(".")))}
                  type="file"
                  accept={"image/*"}
                />}
              </label>
            </Paper>
          </Box>

          <div style={{ marginBottom: 10 }}>
            <TextField
              variant="outlined"
              onChange={handleChange}
              label="Name"
              name="name"
              margin="dense"
              value={values.name}
            ></TextField>
          </div>
          <div>
            <TextField
              variant="outlined"
              onChange={handleChange}
              label="Email"
              name="email"
              margin="dense"
              value={values.email}
            ></TextField>
          </div>
        </Box>
        <Button
          disabled={loading}
          onClick={handleSubmit}
          size="small"
          color="primary"
          variant="contained">
          Update
        </Button>
      </Box>
    </form>
  );
}

function Setting() {
  return <Container>
    <Container style={{ padding: 15, }}>
      <Typography variant="h5">Setting</Typography>
    </Container>
    <Divider />
  </Container>
}

export default () => {
  const [creator, setCreator] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    Creator.get(user?.id)
      .then((c) => {
        setCreator(c);
        setLoading(false);
      })
      .catch(setError);
  }, []);

  if (loading) {
    return <Typography>loading...</Typography>;
  }

  return (
    <Container>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Divider />
      <VerticalTabs tabs={[{
        label: "Profile",
        component: <ProfileEdit creator={creator} />
      }, {
        label: "Account Security",
        component: <ChangePassword />
      }, {
        label: 'Setting',
        component: <Setting />
      }]} />
    </Container>
  );
}
