import { Component, createResource, For, Suspense } from "solid-js";
import init, { fetch_data } from "../pkg/wasm_filter.js";
import "../App.css";

import { M3terHead } from "m3ters-solid";

await init();
const Index: Component = () => {
  const [m3ters] = createResource(fetch_data);

  return (
    <main class="flex mx-auto h-full w-full text-gray-700">
      <ul>
        <Suspense fallback={<div>Loading...</div>}>
          <For each={m3ters()}>
            {(m3ter) => (
              <li>
                ID: <M3terHead seed={m3ter.get("meter_id")} size={150} />
              </li>
            )}
          </For>
        </Suspense>
      </ul>
    </main>
  );
};

export default Index;
