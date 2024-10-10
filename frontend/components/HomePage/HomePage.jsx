"use client";
import Link from "next/link";
import MealsList from "../Meal/MealsList";

function HomePage() {
  return (
    <div className="min-h-screen ">
      <div
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: "url('/HomePage/HomeHeading.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              Discover Delicious Meals
            </h1>
            <p className="text-lg mb-6">
              Savor the Fun! Share Your Favorite Meals and Discover New Flavors
              from Foodies Everywhere!
            </p>
            <Link
              href="/meals"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Explore Our Meals
            </Link>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center">
            Our Top Picks for You
          </h2>
          <MealsList previewCount={3} />
          <div className="text-center mt-6">
            <Link
              href="/meals"
              className="bg-lightMode-bg text-lightMode-text hover:bg-lightMode-hover font-bold py-2 px-4 rounded-full"
            >
              more meals...
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
