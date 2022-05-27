import { Button, ButtonGroup, Center } from "@hope-ui/solid";
import { useSearchParams } from "solid-app-router";
import { Component, Show } from "solid-js";

const BottomNav: Component<{ currentPage: number; totalPages: number }> = (
  props
) => {
  const [, setSearchParams] = useSearchParams();
  const behindPage = () => props.currentPage - 1;
  const aheadPage = () => props.currentPage + 1;
  return (
    <Center>
      <ButtonGroup
        size={"lg"}
        attached
        colorScheme={"neutral"}
        variant={"outline"}
      >
        <Show when={props.currentPage !== 1 && behindPage() !== 1}>
          <Button onClick={() => setSearchParams({ page: 1 })}>1</Button>
          <Show when={1 < behindPage() - 1}>
            <Button disabled variant={"ghost"}>
              ...
            </Button>
          </Show>
        </Show>
        <Show when={behindPage() > 0}>
          <Button onClick={() => setSearchParams({ page: behindPage() })}>
            {behindPage()}
          </Button>
        </Show>
        <Button disabled>{props.currentPage}</Button>
        <Show when={aheadPage() <= props.totalPages}>
          <Button onClick={() => setSearchParams({ page: aheadPage() })}>
            {aheadPage()}
          </Button>
        </Show>
        <Show
          when={
            props.currentPage !== props.totalPages &&
            aheadPage() !== props.totalPages
          }
        >
          <Show when={props.totalPages > aheadPage() + 1}>
            <Button disabled variant={"ghost"}>
              ...
            </Button>
          </Show>
          <Button onClick={() => setSearchParams({ page: props.totalPages })}>
            {props.totalPages}
          </Button>
        </Show>
      </ButtonGroup>
    </Center>
  );
};

export default BottomNav;
