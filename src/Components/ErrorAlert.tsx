import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
} from "@hope-ui/solid";
import { Component, JSX, Show } from "solid-js";

const ErrorAlert: Component<{ title: string; description?: JSX.Element }> = (
  props
) => {
  return (
    <Alert status="danger">
      <AlertIcon mr="$2_5" mb="auto" />
      <Stack direction={"column"}>
        <AlertTitle>{props.title}</AlertTitle>
        <Show when={props.description}>
          <AlertDescription>{props.description}</AlertDescription>
        </Show>
      </Stack>
    </Alert>
  );
};

export default ErrorAlert;
