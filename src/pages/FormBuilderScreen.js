import React from "react";
import FormSchemaBuilder from "../components/formSchemaBuilderComponents/FormSchemaBuilder";
import { StateProvider } from "../contextStore/store";
export default function FormBuilderScreen() {
  return (
    <StateProvider>
      <FormSchemaBuilder />
    </StateProvider>
  );
}
