import { Spinner } from "@hope-ui/solid";
import { Component } from "solid-js";

const LoadingSpinner: Component = () => {
  return (
    <Spinner
      thickness="0.3rem"
      size={"xl"}
      emptyColor="$neutral6"
      color="$primary11"
    />
  );
};

export default LoadingSpinner;
