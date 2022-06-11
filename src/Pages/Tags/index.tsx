import {
  Anchor,
  Button,
  ButtonGroup,
  Center,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
} from "@hope-ui/solid";
import Card from "Components/Card";
import ErrorAlert from "Components/ErrorAlert";
import LoadingSpinner from "Components/LoadingSpinner";
import SqljsServiceContext from "Contexts/SqljsServiceContext";
import { Link } from "solid-app-router";
import {
  Component,
  createEffect,
  createSignal,
  For,
  Match,
  Switch,
  useContext,
} from "solid-js";

type Tags = { [key: string]: { [key: string]: number } };

type TagsState =
  | { type: "Loading" }
  | { type: "Loaded"; tags: Tags }
  | { type: "Error"; error: string };

const QuickJump: Component<{ tags: Tags }> = (props) => {
  return (
    <HStack gap={"$2"} flexWrap={"wrap"}>
      <For each={Object.keys(props.tags).sort()}>
        {(letter) => (
          <Anchor target={"_self"} as={Link} href={`#${letter}`}>
            <Button size={"lg"} type="button">
              {letter.toUpperCase()}
            </Button>
          </Anchor>
        )}
      </For>
    </HStack>
  );
};

const TagGrid: Component<{ tags: Tags }> = (props) => {
  return (
    <SimpleGrid
      columns={{ "@initial": 1, "@sm": 2, "@md": 3, "@2xl": 4 }}
      gap="$6"
    >
      <For each={Object.entries(props.tags).sort()}>
        {([letter, tags]) => (
          <Card>
            <Stack direction={"column"} gap={"$3"}>
              <Heading id={letter} level={1} size={"2xl"}>
                <Center>{letter.toUpperCase()}</Center>
              </Heading>
              <For each={Object.entries(tags).sort()}>
                {([tag, count]) => (
                  <Anchor width={"100%"} as={Link} href={`/?tag=${tag}`}>
                    <ButtonGroup width={"100%"} attached>
                      <Button
                        type="button"
                        variant="outline"
                        css={{ whiteSpace: "unset" }}
                        width={"100%"}
                      >
                        {tag}
                      </Button>
                      <Button type="button">{count}</Button>
                    </ButtonGroup>
                  </Anchor>
                )}
              </For>
            </Stack>
          </Card>
        )}
      </For>
    </SimpleGrid>
  );
};

const Tags: Component = () => {
  const sql = useContext(SqljsServiceContext);
  const [state, setState] = createSignal<TagsState>({
    type: "Loading",
  });

  createEffect(() => {
    if (sql.type === "Loaded") {
      (async () => {
        try {
          const tags = await sql.service.getTags();
          const letterGroups: Tags = {};
          Object.entries(tags).forEach(([tag, count]) => {
            const char = tag.charAt(0).match(/[a-z]/i) ? tag.charAt(0) : "#";
            letterGroups[char] = {
              ...(letterGroups[char] ?? {}),
              [tag]: count,
            };
          });
          setState({ type: "Loaded", tags: letterGroups });
        } catch (error) {
          setState({ type: "Error", error: (error as Error).toString() });
        }
      })();
    }
  });

  const isError = () => {
    const st = state();
    return st.type === "Error" && st;
  };

  const isLoaded = () => {
    const st = state();
    return st.type === "Loaded" && st;
  };

  return (
    <Stack direction={"column"} gap={"$3"}>
      <Heading level={1} size={"3xl"}>
        Tags
      </Heading>
      <Switch>
        <Match when={state().type === "Loading"}>
          <LoadingSpinner />
        </Match>
        <Match when={isError()}>
          {(err) => (
            <ErrorAlert
              title={"There was an error loading the prompt"}
              description={err.error}
            />
          )}
        </Match>
        <Match when={isLoaded()}>
          {(loaded) => (
            <>
              <QuickJump tags={loaded.tags} />
              <TagGrid tags={loaded.tags} />
            </>
          )}
        </Match>
      </Switch>
    </Stack>
  );
};

export default Tags;
