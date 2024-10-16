import React from "react";

const FilterControls = ({
  theme,
  sortKey,
  setSortKey,
  sortDir,
  setSortDir,
  availableReservations,
  setAvailableReservations,
  fetchAllMeals,
}) => {
  return (
    <div className="flex items-center justify-evenly w-4/5 flex-wrap">
      <button
        type="button"
        onClick={fetchAllMeals}
        className={`flex justify-center items-center h-10 px-4 rounded-full ${
          theme.isDarkMode
            ? "bg-darkMode-bg text-darkMode-text hover:bg-darkMode-hover"
            : "bg-lightMode-bg text-lightMode-text hover:bg-lightMode-hover"
        } shadow-md transition duration-200 ease-in-out transform hover:scale-105 w-full max-w-44 mb-2`}
      >
        ✨ View All Meals
      </button>

      <div className="flex flex-col sm:flex-row mb-2 w-full max-w-[400px] items-center m-2">
        <div
          className={`flex items-center m-2 ${
            theme.isDarkMode ? "text-darkMode-text " : " text-lightMode-text "
          } `}
        >
          <label
            htmlFor="sortKey"
            className="mr-1 text-lg italic w-16 text-right "
          >
            Sort by
          </label>
          <select
            id="sortKey"
            className="bg-inherit p-1 w-32 text-center border-b-2 border-lightMode-bg focus:outline-none focus:border-b-4 focus:font-bold"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="when">Date</option>
            <option value="price">Price</option>
            <option value="max_reservations">Max Reservations</option>
          </select>
        </div>

        <div className="flex items-center ">
          <label
            htmlFor="sortDir"
            className="mr-1 text-lg italic w-16 text-right"
          >
            Order
          </label>
          <select
            id="sortDir"
            className="bg-inherit p-1 w-32 text-center border-b-2 border-lightMode-bg focus:outline-none focus:border-b-4 focus:font-bold"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>
      <div className="flex items-center m-2">
        <input
          type="checkbox"
          id="availableReservations"
          checked={availableReservations}
          onChange={(e) => setAvailableReservations(e.target.checked)}
          className={`w-5 h-5 transition-colors duration-200 ease-in-out border-2 rounded-md cursor-pointer accent-lightMode-bg ${
            theme.isDarkMode
              ? "bg-darkMode-bg text-darkMode-text border-darkMode-hover focus:ring-darkMode-text"
              : "bg-lightMode-bg text-lightMode-text border-lightMode-hover focus:ring-lightMode-text"
          }`}
        />
        <label
          htmlFor="availableReservations"
          className={`ml-2 text-lg italic ${
            theme.isDarkMode ? "text-darkMode-text" : "text-lightMode-text"
          }`}
        >
          Available Spots
        </label>
      </div>
    </div>
  );
};

export default FilterControls;
