import { Box, Container, TextField, Button, CircularProgress } from "@material-ui/core"
import { SubHeading } from "common/Typography"
import React, { useState, useEffect } from "react"
import { useAuth } from "services/auth"
import { useFormik } from "formik"
import * as Yup from "yup";
import { useAPI } from "services/APIContext"
import { firebaseAuth } from "services/firebase"
import { useSnackbar } from "notistack"
import { CameraAlt } from "@material-ui/icons"
import { upload } from "services/awsService"
export default () => {
  const { user, refreshUser } = useAuth()
  const { User } = useAPI()
  const { enqueueSnackbar } = useSnackbar()
  const [uploadedPercent, setUploadedPercent] = useState<number>(0);
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const handleCredentialSubmit = async ({ name, photoURL }: {
    name: string,
    photoURL?: string
  }) => {
    try {
      setLoading(true)
      const updated = await User.update({ name })
      await firebaseAuth.currentUser?.updateProfile({ displayName: name, photoURL })
      await refreshUser(updated.data)
      setLoading(false)
      enqueueSnackbar("Profile Updated successfully!", {
        variant: 'success'
      })
    } catch (err) {
      setLoading(false)
      enqueueSnackbar("Failed to update profile", {
        variant: 'error'
      })
    }
  }
  const handleAvatarChange = async (file?: File) => {
    if (file) {
      try {
        setIsAvatarUploading(true)
        const task = upload(`${user?.uid ?? "users"}/avatar-${user?.email}.${file.name.split(".").pop()}`, file);
        task.on('httpUploadProgress', ({ loaded, total }) =>
          setUploadedPercent(loaded / total),
        );
        const { Location: uri } = await task.promise();
        setIsAvatarUploading(false)
        setFieldValue("photoURL", uri);
        setUploadedPercent(0)
      } catch (err) {
        setUploadedPercent(0)
        setIsAvatarUploading(false)
        enqueueSnackbar("Failed to upload your profile picture!", {
          variant: 'error'
        })
      }
    }

  }
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      name: user?.name ?? user?.displayName,
      photoURL: user?.photoURL ?? ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name can't be empty!"),
      photoURL: Yup.string(),
    }),
    onSubmit: handleCredentialSubmit
  });
  return <Container
    onSubmit={handleSubmit}
    noValidate
    component={"form"}
    style={{
      padding: 20, paddingLeft: 25, paddingRight: 25,
      margin: 0,
    }}>
    <SubHeading style={{ marginBottom: 20 }}>Your Profile</SubHeading>
    <Box style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <Box style={{
        display: 'flex', alignItems: 'center', flexDirection: 'column',
        marginRight: 20,
        marginBottom: 15,
        justifyContent: 'center'
      }}>
        <input
          accept="image/*"
          onChange={({ target: { files } }) => handleAvatarChange((files || [])[0])}
          style={{ display: 'none' }}
          id="contained-button-file"
          multiple
          type="file"
        />
        <img style={{ height: 150, width: 150, borderRadius: 150 / 2, background: 'lightgrey' }}
          alt="profile" src={values.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} />
        <label htmlFor="contained-button-file">
          <Button style={{ marginTop: 15, alignSelf: 'center' }}
            size="small"
            component="span"
            disabled={isAvatarUploading || loading}
            startIcon={isAvatarUploading ? <CircularProgress color="inherit" size={20} /> : <CameraAlt color="inherit" fontSize={"small"} />}
            children={isAvatarUploading ? `${Math.floor(uploadedPercent * 100)}%` : "Change"} color="primary" variant="outlined" />
        </label>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'column', }}>
        <TextField
          name={"name"}
          margin="dense"
          value={values.name}
          label="Your name"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.name && !!errors.name}
          variant={"outlined"}
          placeholder="Enter your name"
          helperText={
            touched.name && errors.name
              ? errors?.name
              : ""
          }
        />
        <Button disabled={isAvatarUploading || loading} style={{ marginTop: 15, alignSelf: 'flex-start' }}
          size="small"
          type="submit"
          children={loading ? <CircularProgress color="inherit" size={20} /> : "Update"} color="primary" variant="contained" />
      </Box>
    </Box>
  </Container>
}
