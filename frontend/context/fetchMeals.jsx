// fetch all meals from the API
export const fetchMeals = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-meals`);
    if (!res.ok) {
      throw new Error(`Failed to fetch meals. Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
