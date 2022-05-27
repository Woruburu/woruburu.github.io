import { HopeProvider, HopeThemeConfig } from "@hope-ui/solid";
import { Router } from "solid-app-router";
import { ParentComponent } from "solid-js";
import { SqljsServiceContextProvider } from "./SqljsServiceContext";

const Providers: ParentComponent = (props) => {
  const config: HopeThemeConfig = {
    initialColorMode: "system",
  };

  return (
    <Router>
      <HopeProvider config={config}>
        <SqljsServiceContextProvider>
          {props.children}
        </SqljsServiceContextProvider>
      </HopeProvider>
    </Router>
  );
};

export default Providers;
