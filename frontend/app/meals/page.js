"use client";
import MealsList from "@/components/Meal/MealsList";
import SearchBar from "@/components/ui/SearchBar";
import { useThemeContext } from "@/context/themeContext";
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

  const fetchAllMeals = () => {
    setSubmittedQuery("");
    setSearchQuery("");
  };

  const theme = useThemeContext();
  return (
    <div className="p-5">
      <div className="flex justify-center items-center max-w-5xl mx-auto p-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
        />
        <button
          type="button"
          onClick={fetchAllMeals}
          className={`ml-3 flex justify-center items-center h-10 min-w-max p-3 rounded-full ${
            theme.isDarkMode
              ? "bg-darkMode-bg text-darkMode-text hover:bg-darkMode-hover"
              : "bg-lightMode-bg text-lightMode-text hover:bg-lightMode-hover"
          } shadow-md`}
        >
          Show All Meals
        </button>
      </div>
      {loading && <p className="text-gray-500">Loading meals...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && meals.length === 0 && <p>No meals found.</p>}
      <MealsList meals={meals} />
    </div>
  );
}

export default MealsPage;
