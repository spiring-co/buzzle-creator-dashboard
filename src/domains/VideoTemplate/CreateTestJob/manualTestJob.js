import { Box, Button, TextField, Typography } from "@material-ui/core";
import FileUploader from "common/FileUploader";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

export default ({ version = {}, onSubmitJob }) => {
  const formikSubmit = async (data) => {
    console.log("triggered submit", data);
    onSubmitJob(data);
  };
  const fields = version?.fields ?? [];

  const vs = {};
  fields.map(
    (f) => (vs[f.key] = constraintsToYup(f.type, f.constraints, f.label))
  );

  const fieldComponents = {
    string: (props) => {
      return (
        <TextField
          style={{ flex: 1 }}
          onChange={props?.handleChange}
          value={props?.value}
          placeholder={props?.placeholder}
          maxLength={props?.maxLength}
          readOnly={props?.readonly}
          error={props?.touched && Boolean(props?.error)}
          helperText={props?.touched && props.error}
        />
      );
    },
    image: (props) => {
      return (
        <FileUploader
          value={props?.value}
          cropEnabled={true}
          height={props?.height}
          width={props?.width}
          onChange={(v) => props?.setFieldValue(props?.key, v)}
          uploadDirectory={"jobImages"}
          onError={null}
          name={props?.key + version.id}
        />
      );
    },
  };

  const schema = Yup.object().shape(vs);

  const {
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
    setFieldTouched,
    setFieldValue,
  } = useFormik({
    initialValues: Object.assign({}, ...fields.map((f) => ({ [f.key]: "" }))),
    onSubmit: formikSubmit,
    validationSchema: schema,
  });
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {fields.map((f) => (
          <Box key={f.key}>
            <Typography style={{ flex: 1 }} display="block">
              {f.label}
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
              }}>
              {fieldComponents[f.type]({
                name: f?.key,
                extension: f?.rendererData?.extension,
                key: f?.key,
                value: values[f?.key],
                handleChange: handleChange(f?.key),
                setFieldValue: setFieldValue,
                setFieldTouched: setFieldTouched,
                touched: touched[f?.key],
                label: f?.label,
                placeholder: f?.placeholder,
                height: f?.constraints.height,
                versionId: version.id,
                error: errors[f?.key],
                width: f?.constraints.width,
                ...f?.constraints,
              })}
            </div>
          </Box>
        ))}
        <Button variant="contained" style={{ marginBottom: 20 }} type="submit">
          Save
        </Button>
        <br></br>
      </form>
    </div>
  );

  function constraintsToYup(type, constraints, label) {
    try {
      const yupTypes = {
        string: Yup.string().matches(
          /^[a-zA-Z0-9(&!/'":.\-)\s]*$/,
          "Invalid value, not allowed"
        ),
        image: Yup.string(),
      };
      let y = yupTypes[type];

      Object.keys(constraints).map((k) => {
        switch (k) {
          case "required":
            y = y.required(`${label} is required`);
            break;
          case "maxLength":
            y = y.max(parseInt(constraints[k], 10));
        }
      });
      return y;
    } catch (e) {
      console.error(e);
    }
  }
};

// const Form = styled.form`
//   position: relative;
//   background: white;
//   min-height: 100vh;
//   border-radius: 20px 20px 0px 0px;
//   padding: 25px;
//   box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
// `;

// const Input = styled.div`
//   height: 55px;
//   width: 100%;
//   outline: 0px;
//   background: transparent;
//   margin-left: 20px;
// `;
