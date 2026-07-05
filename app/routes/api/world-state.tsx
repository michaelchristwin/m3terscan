export async function clientLoader() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/world-state`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}
