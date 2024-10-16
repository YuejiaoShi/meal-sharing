"use client";
import Meal from "./Meal";

function MealsList({ meals }) {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <Meal meal={meal} key={meal.id} />
        ))}
      </div>
    </div>
  );
}

export default MealsList;
