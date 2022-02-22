import {  Container } from "@material-ui/core";
import React from "react";
import Graphs from "common/Graphs";
import EmailVerifyAlert from "common/EmailVerifyAlert";

export default function Home() {
  return (
    <Container >
      <EmailVerifyAlert />
      <Graphs />
    </Container>
  );
}
