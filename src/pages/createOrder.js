import { RoundedButton } from "../components/Buttons";
import React, { useEffect, useState } from "react";
import { Prompt, useParams } from "react-router-dom";
import styled from "styled-components";
import { BigButton } from "../components/Buttons";
import renderField from "../components/form_components/renderField";
import { Container, Section } from "../components/Layout";
import { HeaderText } from "../components/Typography";
// import { createOrder } from "../services/api";
// import { getOrder } from "../services/api";
import useApi from "../services/api";
// props = edit props from state, video props from state , versionIndex
export default (props) => {
  const { videoTemplateId } = useParams();

  const { data, loading, error } = useApi(`/video/${videoTemplateId}`);

  const edit = false;
  const [form, setForm] = useState(false);
  let [isBlocking, setIsBlocking] = useState(false);
  const [video, setVideo] = useState(data);
  const [versionIndex, setVersionIndex] = useState(0);
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState({
    country_code: "",
    phone: "",
    fname: "",
    lname: "",
    email: "",
    push_token: "",
  });
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
      }
    } else {
      if (value !== " ") {
        setIsBlocking(true);
      }
      if (name) {
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
        user,
        composition: video.versions[versionIndex].comp_name,
        template: video._id,
        edit,
        uid: video._id,
      };
      console.log("from ", postRequestData);
      const status = true;
      //submit video
      // const status = await createOrder(postRequestData);
      // render video
      const response = await fetch("http://localhost:4488/render", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: postRequestData.form_data,
          composition: postRequestData.composition,
          templateFilePath: videoTemplateId?.fileUr,
        }),
      });
      if (response.ok) {
        setSubmitting(false);
        setForm(false);
        const { message } = await response.json();
        alert(message);
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
    return <div>Loading...</div>;
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
  if (form) {
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
          <LeftFloatingButton
            onClick={() => setActiveSegment(activeSegment - 1)}
          >
            Previous
          </LeftFloatingButton>
        )}
      </Background>
    );
  }
  return (
    <form
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <video
        style={{ height: 400, width: "100%" }}
        controls
        src={video.versions[versionIndex].sample}
        controlsList="nodownload"
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
        alt="Card image"
        controlsList="nodownload"
      />
      <TitleText> {video.title}</TitleText>
      <Picker
        onChange={(e) => {
          console.log(e.target.value);
          setVersionIndex(e.target.value);
        }}
      >
        <Option value="" disabled selected>
          Touch to Select a Version
        </Option>
        {video.versions.map((v, i) => {
          return (
            <Option value={i} key={i}>
              {v.title}
            </Option>
          );
        })}
      </Picker>
      <HeaderText style={{ fontSize: "25px" }}>
        {versionIndex !== null &&
          (video.versions[versionIndex].price === "0"
            ? `Free`
            : `  ₹${video.versions[versionIndex].price}`)}
      </HeaderText>

      <BodyText>{video.description}</BodyText>
      <input
        style={styles.input}
        placeholder="Enter First Name"
        type="text"
        value={user.fname}
        required
        onChange={(e) => setUser({ ...user, fname: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Enter Last Name"
        type="text"
        value={user.lname}
        required
        onChange={(e) => setUser({ ...user, lname: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="email"
        type="email"
        required
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Phone Number"
        type="tel"
        required
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />
      <BigButton
        type="submit"
        onClick={() => {
          if (user.email === "") {
            alert("Email is required");
          } else if (user.fname === "") {
            alert("Name is required");
          } else if (user.phone === "") {
            alert("Phone Number is required");
          } else {
            setForm(true);
          }
        }}
      >
        TRY FOR FREE
      </BigButton>
    </form>
  );
};
const styles = {
  input: {
    border: 0,
    borderBottom: "2px solid #e3e3e3",
    fontSize: 16,
    fontFamily: "poppins",
    marginBottom: 20,
  },
};
const Picker = styled.select`
  height: 35px;
  width: 100%;
  margin-left: 20px;
  margin-right: 20px;
  outline: 0px;
  margin-top: 20px;
  background: transparent;
  font-size: 16px;
  font-family: poppins;
  font-weight: 700;
  color: rgb(33, 33, 33);
  border: none;
  margin-bottom: 20px;
  border-bottom: 2px solid #e3e3e3;
  border-radius: 0;
  &:after {
    content: "▼";
  }
  &:focus {
    background: aliceblue;
  }
`;
const BodyText = styled.p`
  margin-bottom: 10px;
  font-size: 14px;
  font-family: Poppins;
  color: #212121;
`;

const Option = styled.option`
  fontsize: "18px";
  background-color: "white";
  font-family: "Poppins";
  font-weight: "700";
  color: "black";
`;

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
const TitleText = styled.p`
  margin-bottom: 15px;
  margin-top: 15px;
  font-size: 30px;
  font-weight: 700;
  font-family: Poppins;
  color: #000000;
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
