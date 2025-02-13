import { Component, createResource, For, Suspense } from "solid-js";
import { fetchFromArweave } from "../utils/query.data";
import "../App.css";

const Index: Component = () => {
  const [m3ters] = createResource(fetchFromArweave);

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <ul>
        <Suspense fallback={<div>Loading...</div>}>
          <For each={m3ters()}>
            {(m3ter) => <li>{m3ter.input.payload[0]}</li>}
          </For>
        </Suspense>
      </ul>
    </main>
  );
};

export default Index;
