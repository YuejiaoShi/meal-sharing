"use client";
import { fetchMeals } from "@/lib/fetchMeals";
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
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mealsToDisplay.map((meal) => (
          <Meal meal={meal} key={meal.id} />
        ))}
      </div>
    </div>
  );
}

export default MealsList;
