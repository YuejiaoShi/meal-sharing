export const fetchMealById = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch meal by id. Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
