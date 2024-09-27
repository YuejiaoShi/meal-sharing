"use client";
import { useEffect, useState } from "react";

function MealsList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/all-meals");
        if (!res.ok) {
          throw new Error(`Failed to fetch meals. Status: ${res.status}`);
        }
        const data = await res.json();
        setMeals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div>
      {meals.map((meal) => (
        <p>{meal.title}</p>
      ))}
    </div>
  );
}

export default MealsList;
