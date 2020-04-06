import { RoundedButton } from "../components/Buttons";
import React, { useEffect, useState } from "react";
import { Prompt, useParams } from "react-router-dom";
import styled from "styled-components";

import renderField from "../components/form_components/renderField";
import { Container, Section } from "../components/Layout";
import { HeaderText } from "../components/Typography";
// import { createOrder } from "../services/api";
// import { getOrder } from "../services/api";
import useApi from "../services/api";
import FormPlaceholder from "../components/form_components/placeholder/FormPlaceholder";

// props = edit props from state, video props from state , versionIndex
export default (props) => {
  const { videoTemplateId } = useParams();
  let version = 0;
  const { data, loading, error } = useApi(`/video/${videoTemplateId}`);
  // const edit = props?.location?.state?.edit ?? false;
  const edit = false;
  let [isBlocking, setIsBlocking] = useState(false);
  const [video, setVideo] = useState(data);
  const [versionIndex, setVersionIndex] = useState(version);
  const [order, setOrder] = useState(null);
  // const [error, setError] = useState(null);
  const [activeSegment, setActiveSegment] = useState(0);
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (edit) {
      // get Order from uid
      // getOrder(uid)
      //   .then((order) => {
      //     console.log(order);
      //     (order?.form_data?.assets ?? []).forEach((a) => {
      //       order.form_data.data[`asset:${a.name}`] = a.src;
      //     });
      //     setOrder(order);
      //     setLoading(false);
      //   })
      //   .catch(setError);
    } else {
      setVideo(data);
      console.log(video);
    }
  }, [loading, data, error]);

  useEffect(() => {}, [activeSegment]);

  const handleChange = (label, name, value, required) => {
    if (required) {
      if (value === "") {
        alert(label + " Cannot Be Empty");
      } else {
        if (value !== " ") {
          setIsBlocking(true);
        }
        formData[name] = value;
        setFormData({ ...formData });
      }
    }
  };

  const onSubmit = async (e) => {
    console.log("on submit1");
    e.preventDefault();
    if (!validateForm(formData)) return false;
    console.log("on submit2");

    try {
      setSubmitting(true);
      const postRequestData = {
        assets: deserializeAssets(formData),
        form_data: formData,
        user: {
          // get user details
        },
        composition: video.versions[versionIndex].comp_name,
        template: video.uid,
        edit,
        uid: video.uid,
      };
      console.log("from ", postRequestData);
      const status = true;
      //submit video
      // const status = await createOrder(postRequestData);
      if (status) {
        setSubmitting(false);
        alert("Your Order Will Be Ready Soon");
      }
    } catch (err) {
      setSubmitting(false);
      alert(err);
    }
  };

  const { segments } = video?.versions[versionIndex]?.form || {
    segments: [],
  };

  if (loading) {
    return <FormPlaceholder />;
  }
  if (submitting) {
    return (
      <div
        style={{
          display: "flex",
          marginTop: "15%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Submitting please wait...</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ textAlign: "center" }}>
        <h3 style={{ color: "red" }}>{error.message}</h3>
      </div>
    );
  }

  const validateForm = (data) => {
    for (let s = 0; s < segments.length; s++) {
      for (let f = 0; f < segments[s].fields.length; f++) {
        console.log(s, f);

        const field = segments[s].fields[f];
        if (!data[field.name] && field.required) {
          console.log("failed");
          alert(`${field.label} is required!`);
          setActiveSegment(s);
          return false;
        }
      }
    }
    return true;
  };

  return (
    <Background>
      <Container style={{ position: "relative" }}>
        <Prompt when={isBlocking} message={`You will lose all your data.`} />
        <Form noValidate={true} onSubmit={onSubmit} onChange={handleChange}>
          {segments.map((s, i) => (
            <FormSegment
              style={
                activeSegment === i
                  ? { opacity: 1, zIndex: 99 }
                  : { opacity: 0, zIndex: 0, transform: "translate(10%,0)" }
              }
            >
              <HeaderText>{s.title}</HeaderText>
              <Section>
                {s.fields.map((f) =>
                  renderField(f, handleChange, edit ? order : null)
                )}
              </Section>
            </FormSegment>
          ))}
          {activeSegment === segments.length - 1 && (
            <RightFloatingButton type="submit">Submit</RightFloatingButton>
          )}
        </Form>
      </Container>

      {activeSegment < segments.length - 1 && (
        <RightFloatingButton
          onClick={() => setActiveSegment(activeSegment + 1)}
        >
          Next
        </RightFloatingButton>
      )}

      {activeSegment > 0 && (
        <LeftFloatingButton onClick={() => setActiveSegment(activeSegment - 1)}>
          Previous
        </LeftFloatingButton>
      )}
    </Background>
  );
};

const Background = styled.div`
  width: 100%;
  display: flex;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Form = styled.form`
  position: relative;
  overflow: hidden;
  background: white;
  height: 100vh;
  border-radius: 20px 20px 0px 0px;
  padding: 25px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const FormSegment = styled.div`
  transition-property: opacity, transform;
  transition: 0.2s;
  transition-timing-function: ease;
  position: absolute;
  margin: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px;
`;

const LeftFloatingButton = styled(RoundedButton)`
  position: absolute;
  left: 5vw;
  bottom: 8vh;
  z-index: 999;
`;

const RightFloatingButton = styled(RoundedButton)`
  position: absolute;
  right: 2vw;
  bottom: 8vh;
  z-index: 999;
`;

const deserializeAssets = (data) => {
  let assets = [];
  for (let key in data) {
    if (/asset:/.test(key)) {
      let name = key.split(":")[1];
      let type = name.split(".")[name.split(".").length - 1];
      let asset = {
        src: data[key],
        name,
        type,
      };
      assets.push(asset);
      delete data[key];
    }
  }
  return assets;
};
