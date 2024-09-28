"use client";
import { fetchMeals } from "@/context/fetchMeals";
import { useEffect, useState } from "react";
import Meal from "./Meal";

function MealsList({ previewCount = 0 }) {
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

  const mealsToDisplay =
    previewCount > 0 ? meals.slice(0, previewCount) : meals;

  return (
    <div>
      {mealsToDisplay.map((meal) => (
        <Meal meal={meal} key={meal.id} />
      ))}
    </div>
  );
}

export default MealsList;
