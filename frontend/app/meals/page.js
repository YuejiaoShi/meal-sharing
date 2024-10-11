"use client";
import MealsList from "@/components/Meal/MealsList";
import SearchBar from "@/components/ui/SearchBar";
import { fetchMeals } from "@/lib/fetchMeals";
import { searchMealsByTitle } from "@/lib/searchMealsByTitle";
import { useEffect, useState } from "react";

function MealsPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        let mealsData;
        if (submittedQuery.trim()) {
          mealsData = await searchMealsByTitle(submittedQuery);
        } else {
          mealsData = await fetchMeals();
        }
        setMeals(mealsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, [submittedQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Please enter a meal title to search.");
      return;
    }
    setSubmittedQuery(searchQuery);
    setSearchQuery("");
  };

  return (
    <div>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearchSubmit}
      />
      {loading && <p>Loading meals...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && meals.length === 0 && <p>No meals found.</p>}
      <MealsList meals={meals} />
    </div>
  );
}

export default MealsPage;
