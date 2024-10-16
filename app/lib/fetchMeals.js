export const fetchMeals = async ({
  sortKey = "id",
  sortDir = "ASC",
  availableReservations = null,
} = {}) => {
  try {
    let queryParams = new URLSearchParams({
      sortKey,
      sortDir,
    });

    if (availableReservations !== null) {
      queryParams.append(
        "availableReservations",
        availableReservations ? "true" : null
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meals?${queryParams.toString()}`
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
