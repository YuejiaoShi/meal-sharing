import { fetchMeals } from "@/lib/fetchMeals";

export async function searchMealsByTitle(title) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meals?title=${title}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch meals");
      s;
    }
    const meals = await response.json();

    return meals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return [];
  }
}
