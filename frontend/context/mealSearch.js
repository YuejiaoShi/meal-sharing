import axios from "axios";

export const mealSearch = async (title) => {
  if (!title) {
    throw new Error("Title parameter is required for meal search.");
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/meals`,
      {
        params: { title },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const meals = response.data;

    if (meals.length > 0) {
      const mealId = meals[0].id;
      window.location.href = `/meals/${mealId}`;
    } else {
      alert("No meals found for the given title.");
    }
  } catch (error) {
    console.error("Failed to fetch meals:", error);
    alert("An error occurred while searching for meals.");
  }
};
