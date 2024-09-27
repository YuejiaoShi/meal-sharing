"use client";
import { useEffect, useState } from "react";
import { fetchMeals } from "./context/fetchMeals";

function MealsList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const mealsData = await fetchMeals();
        setMeals(mealsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, []);

  return (
    <div>
      {meals.map((meal) => (
        <div key={meal.id}>
          <p>
            <strong>Title:</strong> {meal.title}
          </p>
          <p>
            <strong>Description:</strong> {meal.description}
          </p>
          <p>
            <strong>Price:</strong> ${meal.price}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MealsList;
