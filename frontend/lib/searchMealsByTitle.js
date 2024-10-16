export async function searchMealsByTitle(title, sortKey, sortDir) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/meals?title=${title}`;

    if (sortKey) {
      url += `&sortKey=${sortKey}`;
    }
    if (sortDir) {
      url += `&sortDir=${sortDir}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch meals");
    }

    const meals = await response.json();
    return meals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return [];
  }
}
