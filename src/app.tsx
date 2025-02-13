import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider, Title, Link, Meta } from "@solidjs/meta";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
  return (
    <MetaProvider>
      <div class="Root">
        <Title>M3terscan</Title>
        <Link rel="canonical" href="https://m3terscan.xyz" />
        <Meta name="example" content="whatever" />
      </div>
      <Router
        root={(props) => (
          <>
            <Nav />
            <Suspense>{props.children}</Suspense>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
