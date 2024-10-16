const fetchAverageStars = async (mealId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meals/${mealId}/average_stars`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch average rating");
    }
    const data = await response.json();
    return data.averageStars;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default fetchAverageStars;
