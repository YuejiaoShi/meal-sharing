"use client";
import Link from "next/link";
import MealsList from "../Meal/MealsList";

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <MealsList previewCount={3} />
      <Link
        href="/meals"
        className="text-blue-700"
        onClick={() => (window.location.href = "/meals")}
      >
        more meals...
      </Link>
    </div>
  );
}

export default HomePage;
