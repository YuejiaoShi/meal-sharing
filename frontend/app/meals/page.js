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
  const [sortKey, setSortKey] = useState("when");
  const [sortDir, setSortDir] = useState("ASC");

  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        let mealsData;
        if (submittedQuery.trim()) {
          mealsData = await searchMealsByTitle(
            submittedQuery,
            sortKey,
            sortDir
          );
        } else {
          mealsData = await fetchMeals({ sortKey, sortDir });
        }
        setMeals(mealsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, [submittedQuery, sortKey, sortDir]);

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
        <button
          type="button"
          onClick={fetchAllMeals}
          className={`mr-5 flex justify-center items-center h-10 min-w-max p-3 rounded-full ${
            theme.isDarkMode
              ? "bg-darkMode-bg text-darkMode-text hover:bg-darkMode-hover"
              : "bg-lightMode-bg text-lightMode-text hover:bg-lightMode-hover"
          } shadow-md`}
        >
          ✨ Show All Meals
        </button>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
        />
      </div>

      <div className="flex justify-center items-center mb-4">
        <select
          className="mr-2 p-2 border rounded"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="when">Date</option>
          <option value="price">Price</option>
          <option value="max_reservations">Max Reservations</option>
        </select>
        <select
          className="p-2 border rounded"
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value)}
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>

      {loading && (
        <div className="text-gray-500 italic text-xl flex flex-col items-center justify-center">
          <p className="animate-pulse text-lg font-semibold">
            Loading meals...
          </p>
        </div>
      )}
      {error && (
        <p className="bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded-md shadow-md transition-transform transform hover:scale-105">
          Error: {error}
        </p>
      )}
      {!loading && !error && meals.length === 0 && (
        <div className="text-gray-500 italic text-xl flex flex-col items-center justify-center">
          <p>No meals found :(</p>
          <p> Try to search something else.</p>
        </div>
      )}
      <MealsList meals={meals} />
    </div>
  );
}

export default MealsPage;
