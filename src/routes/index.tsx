import { Component, createResource, For, Suspense } from "solid-js";
import init, { fetch_data } from "../pkg/wasm_filter.js";
import "../App.css";
//@ts-ignore
import { M3terHead } from "m3ters";

await init();
const Index: Component = () => {
  const [m3ters] = createResource(fetch_data);

  return (
    <main class="flex mx-auto h-[100vh] text-gray-700 w-[100vw]">
      <ul>
        <Suspense fallback={<div>Loading...</div>}>
          <For each={m3ters()}>
            {(m3ter) => (
              <li>
                ID: <M3terHead id={m3ter.get("meter_id")} />
              </li>
            )}
          </For>
        </Suspense>
      </ul>
    </main>
  );
};

export default Index;
