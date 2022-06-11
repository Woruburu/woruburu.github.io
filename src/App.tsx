import { Box, Container } from "@hope-ui/solid";
import Navbar from "Components/Navbar";
import TopLoader from "Components/TopLoader";
import Providers from "Contexts/Providers";
import { Route, Routes } from "solid-app-router";
import { Component, createSignal, lazy, Suspense } from "solid-js";

const Home = lazy(() => import("./Pages/Home"));
const Prompt = lazy(() => import("./Pages/Prompt"));
const Tags = lazy(() => import("./Pages/Tags"));

const App: Component = () => {
  const [ref, setRef] = createSignal<HTMLDivElement>();
  return (
    <>
      <Box
        zIndex={10}
        position={"absolute"}
        top={0}
        right={0}
        left={0}
        ref={setRef}
        id={"top-loader"}
      />
      <Providers>
        <Navbar />
        <Container padding={"$2"}>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<TopLoader el={ref()} />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="/:id"
              element={
                <Suspense fallback={<TopLoader el={ref()} />}>
                  <Prompt />
                </Suspense>
              }
            />
            <Route
              path="/tags"
              element={
                <Suspense fallback={<TopLoader el={ref()} />}>
                  <Tags />
                </Suspense>
              }
            />
          </Routes>
        </Container>
      </Providers>
    </>
  );
};

export default App;
