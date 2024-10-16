import { useEffect, useState } from "react";
import { useThemeContext } from "@/context/themeContext";
import Link from "next/link";
import fetchAverageStars from "@/lib/fetchAverageStars";

function Meal({ meal }) {
  const theme = useThemeContext();
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const getAverageRating = async () => {
      const rating = await fetchAverageStars(meal.id);
      setAverageRating(rating);
    };

    getAverageRating();
  }, [meal.id]);

  return (
    <Link href={`/meals/${meal.id}`}>
      <div
        className={`flex flex-col justify-between rounded-lg h-full p-6 transition-shadow duration-200 ${
          theme.isDarkMode
            ? "bg-darkMode-bg text-darkMode-text hover:shadow-[0_0_10px_#9bebc9]"
            : "bg-white text-lightMode-text shadow-md hover:shadow-[0_0_10px_#9bebc9]"
        }`}
      >
        <div>
          <img
            className="w-full h-48 object-cover rounded-t-lg mb-4"
            src={meal.image}
            alt={`image of ${meal.title}`}
          />
          <div className="mt-4 flex flex-row justify-between">
            <p className="text-lg font-semibold">{meal.title}</p>
            <p className="font-bold text-yellow-500">
              {averageRating !== null ? (
                <span>
                  <span>{averageRating}</span> / 5 <span>&#9733;</span>
                </span>
              ) : (
                <span>No ratings yet</span>
              )}
            </p>
          </div>
          <p
            className={`mt-2 ${
              theme.isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {meal.description}
          </p>
        </div>
        <div className="flex mt-4 flex-row justify-between">
          <p className="font-bold">{meal.price} DKK</p>
          {meal.available_seats <= 0 ? (
            <p className="text-red-500 font-bold">No spots left :(</p>
          ) : (
            <p>
              <strong>{meal.available_seats}</strong>
              <span> spots left</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Meal;
