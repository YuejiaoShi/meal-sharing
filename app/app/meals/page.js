"use client";
import { useEffect, useState } from "react";
import MealsList from "@/components/Meal/MealsList";
import SearchBar from "@/components/ui/SearchBar";
import { useThemeContext } from "@/context/themeContext";
import { fetchMeals } from "@/lib/fetchMeals";
import { searchMealsByTitle } from "@/lib/searchMealsByTitle";
import FilterControls from "@/components/Meal/FilterControls";


function MealsPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [sortKey, setSortKey] = useState("when");
  const [sortDir, setSortDir] = useState("ASC");
  const [availableReservations, setAvailableReservations] = useState(null);

  const theme = useThemeContext();

  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const mealsData = submittedQuery.trim()
          ? await searchMealsByTitle(
              submittedQuery,
              sortKey,
              sortDir,
              availableReservations
            )
          : await fetchMeals({ sortKey, sortDir, availableReservations });

        setMeals(mealsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, [submittedQuery, sortKey, sortDir, availableReservations]);

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

  return (
    <div className="p-5">
      <div className="flex justify-center items-center max-w-5xl mx-auto p-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
        />
      </div>

      <div className="max-w-5xl mx-auto flex justify-evenly items-center pt-2 flex-wrap">
        <FilterControls
          theme={theme}
          sortKey={sortKey}
          setSortKey={setSortKey}
          sortDir={sortDir}
          setSortDir={setSortDir}
          availableReservations={availableReservations}
          setAvailableReservations={setAvailableReservations}
          fetchAllMeals={fetchAllMeals}
        />
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
