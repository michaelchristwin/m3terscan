export async function clientLoader() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/recent-blocks`,
    {
      method: "GET",
    },
  );
  const data = await response.json();
  return data;
}

export async function clientAction() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/recent-blocks`,
    {
      method: "POST",
    },
  );

  return response;
}
