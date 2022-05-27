import { Container, Flex, Spinner, Stack } from "@hope-ui/solid";
import ErrorAlert from "Components/ErrorAlert";
import TopLoader from "Components/TopLoader";
import SqljsService from "Services/SqljsService";
import {
  createContext,
  createEffect,
  createSignal,
  Match,
  ParentComponent,
  Show,
  Switch,
} from "solid-js";
import SqlWorker from "sql.js/dist/worker.sql-wasm.js?worker";
import { v4 } from "uuid";
const worker = new SqlWorker();

type SqljsServiceContextState =
  | { type: "Loading" }
  | { type: "Error"; error: string }
  | { type: "Loaded"; service: SqljsService };

const SqljsServiceContext = createContext<SqljsServiceContextState>({
  type: "Loading",
});

export const SqljsServiceContextProvider: ParentComponent = (props) => {
  const [state, setState] = createSignal<SqljsServiceContextState>({
    type: "Loading",
  });
  const [loadingMax, setLoadingMax] = createSignal<number>();
  const [loadingValue, setLoadingValue] = createSignal<number>();

  createEffect(() => {
    const requestId = v4();

    worker.onmessage = (e) => {
      if (e.data.id == requestId) {
        if (e.data.error) {
          setState({ type: "Error", error: e.data.error });
          return;
        }

        setState({ type: "Loaded", service: new SqljsService(worker) });
      }
    };

    (async () => {
      try {
        const response = await fetch(
          new URL(
            import.meta.env["VITE_DB_PATH"] ?? "",
            window.location.href
          ).toString()
        );

        const maxLength = Number.parseInt(
          response.headers.get("Content-Length") ?? "0"
        );
        setLoadingMax(maxLength);

        const reader = (response.body ?? new ReadableStream()).getReader();
        const readableStream = new ReadableStream({
          async start(controller) {
            let isDone = false;
            const pump = async (): Promise<void> => {
              const { done, value } = await reader.read();
              isDone = done;
              if (done) {
                isDone = done;
                return;
              }
              setLoadingValue((prev) => (prev ?? 0) + value.length);
              controller.enqueue(value);
            };
            while (!isDone) {
              await pump();
            }
            controller.close();
          },
        });
        const newResponse = new Response(readableStream);
        const buf = await newResponse.arrayBuffer();

        worker.postMessage({
          id: requestId,
          action: "open",
          buffer: buf,
        });
      } catch (e) {
        setState({ type: "Error", error: (e as Error).toString() });
      }
    })();
  });

  const isError = () => {
    const st = state();
    return st.type === "Error" && st;
  };

  return (
    <Switch>
      <Match when={isError()}>
        {(e) => (
          <Container padding={"$2"}>
            <ErrorAlert
              title={"Could not load database"}
              description={e.error}
            ></ErrorAlert>
          </Container>
        )}
      </Match>
      <Match when={state().type === "Loading"}>
        <>
          <TopLoader value={loadingValue()} max={loadingMax()} />
          <Container centerContent padding={"$2"}>
            <Show
              when={loadingValue() && loadingMax()}
              fallback={"Loading Database Engine"}
            >
              {(loadingMax) => (
                <>
                  <Stack gap={"$3"}>
                    <>
                      Downloading Database (
                      {(loadingMax / (1024 * 1024)).toFixed(2)}MB)...
                    </>
                    <Flex>
                      <Spinner m={"auto"} size={"xs"} />
                    </Flex>
                  </Stack>
                  (This may take a while)
                </>
              )}
            </Show>
          </Container>
        </>
      </Match>
      <Match when={state().type === "Loaded" && state()}>
        <SqljsServiceContext.Provider value={state()}>
          {props.children}
        </SqljsServiceContext.Provider>
      </Match>
    </Switch>
  );
};

export default SqljsServiceContext;
