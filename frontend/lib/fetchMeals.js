export const fetchMeals = async ({ sortKey = "id", sortDir = "ASC" } = {}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meals?sortKey=${sortKey}&sortDir=${sortDir}`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch meals. Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
