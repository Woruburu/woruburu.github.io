import { Anchor } from "@hope-ui/solid";
import ErrorAlert from "Components/ErrorAlert";
import LoadingSpinner from "Components/LoadingSpinner";
import SqljsServiceContext from "Contexts/SqljsServiceContext";
import { Prompt as PromptType } from "Services/SqljsService";
import { Link, useParams } from "solid-app-router";
import {
  Component,
  createEffect,
  createSignal,
  Match,
  Switch,
  useContext,
} from "solid-js";
import PromptDisplay from "./PromptDisplay";

type PromptState =
  | { type: "Loading" }
  | { type: "NotFound" }
  | { type: "Error"; error: string }
  | { type: "Loaded"; prompt: PromptType };

const Prompt: Component = () => {
  const sql = useContext(SqljsServiceContext);
  const params = useParams();
  const [state, setState] = createSignal<PromptState>({ type: "Loading" });

  createEffect(() => {
    (async () => {
      if (sql.type === "Loaded" && params.id) {
        try {
          const prompt = await sql.service.get(params.id);
          if (prompt) {
            setState({ type: "Loaded", prompt });
          } else {
            setState({ type: "NotFound" });
          }
        } catch (error) {
          setState({ type: "Error", error: (error as Error).toString() });
        }
      }
    })();
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
    <Switch>
      <Match when={state().type === "Loading"}>
        <LoadingSpinner />
      </Match>
      <Match when={state().type === "NotFound"}>
        <>
          <ErrorAlert
            title={"Prompt does not exist"}
            description={
              <Anchor as={Link} href="/">
                Click here to go back to the main page
              </Anchor>
            }
          />
        </>
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
        {(loaded) => <PromptDisplay prompt={loaded.prompt} />}
      </Match>
    </Switch>
  );
};

export default Prompt;
