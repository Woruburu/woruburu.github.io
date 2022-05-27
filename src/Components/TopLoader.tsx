import { Progress, ProgressIndicator } from "@hope-ui/solid";
import { Component, createSignal, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";

const TopLoader: Component<{
  el?: HTMLDivElement;
  value?: number;
  max?: number;
}> = (props) => {
  const [el, setEl] = createSignal<HTMLElement>();

  onMount(() => {
    setEl(props.el ?? document.getElementById("top-loader") ?? undefined);
  });

  return (
    <Show when={el()}>
      {(ele) => (
        <Portal mount={ele}>
          <Progress
            size="xs"
            indeterminate={props.value && props.max ? false : true}
            max={props.max}
            value={props.value}
          >
            <ProgressIndicator />
          </Progress>
        </Portal>
      )}
    </Show>
  );
};

export default TopLoader;
