export const careerhub = async () => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  const res = await fetch(`${serverUrl}/api/career-hub`);
  return res.json();
};

export const getCareerHubById = async (id) => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  const res = await fetch(`${serverUrl}/api/career-hub/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch career hub item with id ${id}`);
  }
  return res.json();
};
