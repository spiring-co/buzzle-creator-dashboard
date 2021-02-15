// import { useFormik } from "formik";
// import React, { useState, useEffect, lazy } from "react";
// import * as Yup from "yup";
// import { Box, Button, TextField, Typography } from "@material-ui/core";

// import FileUploader from "common/FileUploader";

// export default ({ fields = [], onSubmitForm, versionId }) => {
//   useEffect(() => {
//     console.log("here");
//     console.log(fields);
//   }, [fields]);

//   const formikSubmit = async (data) => {
//     console.log("triggered submit", data);
//     onSubmitForm(data);
//   };

//   const vs = {};
//   fields.map(
//     (f) => (vs[f.key] = constraintsToYup(f.type, f.constraints, f.label))
//   );

//   const fieldComponents = {
//     string: (props) => {
//       console.log(
//         props?.handleBlur,
//         props?.touched,
//         Boolean(props?.error),
//         props?.placeholder
//       );
//       return (
//         <TextField
//           onChange={props?.handleChange}
//           value={props?.value}
//           onBlur={() => props?.setFieldTouched(props?.key, true)}
//           placeholder={props?.placeholder}
//           maxLength={props?.maxLength}
//           readOnly={props?.readonly}
//           error={props?.touched && Boolean(props?.error)}
//           helperText={props?.touched && props.error}
//         />
//       );
//     },
//     image: (props) => {
//       return (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-evenly",
//           }}>
//           <FileUploader
//             value={props?.value}
//             cropEnabled={true}
//             height={props?.height}
//             width={props?.width}
//             onChange={(v) => props?.setFieldValue(props?.key, v)}
//             uploadDirectory={"jobImages"}
//             onError={null}
//             name={props?.key + props?.versionId}
//           />
//         </div>
//       );
//     },
//   };

//   const schema = Yup.object().shape(vs);

//   const {
//     handleSubmit,
//     handleChange,
//     values,
//     touched,
//     errors,
//     handleBlur,
//     setFieldTouched,
//     setFieldValue,
//   } = useFormik({
//     initialValues: Object.assign({}, ...fields.map((f) => ({ [f.key]: "" }))),
//     onSubmit: formikSubmit,
//     validationSchema: schema,
//   });
//   console.log(values, touched);
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <Box>
//           {fields.map((f) => (
//             <Box
//               key={f.key}
//               style={{
//                 flexDirection: "row",
//                 display: "flex",
//                 justifyContent: "space-evenly",
//                 alignSelf: "center",
//               }}>
//               <Typography display="block">{f.label}</Typography>
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 {fieldComponents[f.type]({
//                   name: f?.key,
//                   extension: f?.rendererData?.extension,
//                   key: f?.key,
//                   value: values[f?.key],
//                   handleChange: handleChange(f?.key),
//                   setFieldValue: setFieldValue,
//                   setFieldTouched: setFieldTouched,
//                   touched: touched[f?.key],
//                   handleBlur: () => handleBlur(f?.key),
//                   label: f?.label,
//                   placeholder: f?.placeholder,
//                   height: f?.constraints.height,
//                   versionId: versionId,
//                   error: errors[f?.key],
//                   width: f?.constraints.width,
//                   ...f?.constraints,
//                 })}
//               </div>
//             </Box>
//           ))}
//           <Button
//             variant="contained"
//             style={{ marginLeft: 50, marginBottom: 20 }}
//             type="submit">
//             Save
//           </Button>
//         </Box>
//       </form>
//     </div>
//   );

//   function constraintsToYup(type, constraints, label) {
//     try {
//       const yupTypes = {
//         string: Yup.string().matches(
//           /^[a-zA-Z0-9(&!/'":.\-)\s]*$/,
//           "Invalid value, not allowed"
//         ),
//         image: Yup.string(),
//       };
//       let y = yupTypes[type];

//       Object.keys(constraints).map((k) => {
//         switch (k) {
//           case "required":
//             y = y.required(`${label} is required`);
//             break;
//           case "maxLength":
//             y = y.max(parseInt(constraints[k], 10));
//         }
//       });
//       return y;
//     } catch (e) {
//       console.error(e);
//     }
//   }
// };
