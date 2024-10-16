import { useThemeContext } from "@/context/themeContext";
import Link from "next/link";

function Meal({ meal }) {
  const theme = useThemeContext();
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
            className="w-full h-48 object-cover rounded-t-lg"
            src={meal.image}
            alt={`image of ${meal.title}`}
          />
          <div className="mt-4">
            <p className="text-lg font-semibold">
              <strong>Title:</strong> {meal.title}
            </p>
            <p
              className={`mt-2 ${
                theme.isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <strong>Description:</strong> {meal.description}
            </p>
          </div>
        </div>
        <p className="mt-4 font-bold">
          <strong>Price: </strong>
          {meal.price} kr
        </p>
      </div>
    </Link>
  );
}

export default Meal;
