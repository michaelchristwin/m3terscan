import { Component, createResource, For, Suspense } from "solid-js";
//import { fetchFromArweave } from "../utils/query.data";
import init, { fetch_data } from "../pkg/wasm_filter.js";
import "../App.css";

await init();
const Index: Component = () => {
  const [m3ters] = createResource(fetch_data);

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <ul>
        <Suspense fallback={<div>Loading...</div>}>
          <For each={m3ters()}>
            {(m3ter) => <li>ID: {m3ter.get("meter_id")}</li>}
          </For>
        </Suspense>
      </ul>
    </main>
  );
};

export default Index;
