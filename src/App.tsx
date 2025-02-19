/* @refresh reload */
import { lazy, ParentComponent } from "solid-js";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "./index.css";
import Navbar from "./components/Navbar";

const Layout: ParentComponent = (props) => {
  return (
    <div class="px-6 py-3 w-[100vw] h-[100vh]">
      <Navbar />
      {props.children}
    </div>
  );
};

const routes = [
  {
    path: "/",
    component: lazy(() => import("./routes")),
  },
];
const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => <Router root={Layout}>{routes}</Router>, root!);
