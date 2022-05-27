/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

const root = document.createElement("div");
document.body.appendChild(root);
render(() => <App />, root);
