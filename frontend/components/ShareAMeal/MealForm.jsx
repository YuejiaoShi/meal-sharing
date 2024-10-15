"use client";

import { useThemeContext } from "@/context/themeContext";

const MealForm = ({
  mealData,
  setMealData,
  handleSubmit,
  selectedImage,
  setSelectedImage,
  error,
  message,
  loading,
}) => {
  const theme = useThemeContext();

  const fieldConfigs = [
    { name: "title", type: "text", label: "Title", required: true },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      required: true,
    },
    { name: "location", type: "text", label: "Location", required: true },
    {
      name: "max_reservations",
      type: "number",
      label: "Max Reservations",
      required: true,
    },
    {
      name: "price",
      type: "number",
      label: "Price",
      required: true,
      step: "0.01",
    },
    {
      name: "when",
      type: "datetime-local",
      label: "When (YYYY-MM-DD HH:MM:SS)",
      required: true,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "when") {
      const date = new Date(value);
      const formattedDate = `${date
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}`;
      setMealData({ ...mealData, [name]: formattedDate });
    } else if (name === "max_reservations" || name === "price") {
      setMealData({ ...mealData, [name]: Number(value) });
    } else {
      setMealData({ ...mealData, [name]: value });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB.");
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setMealData({ ...mealData, image: file });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-lg mx-auto p-6 rounded-lg shadow-xl ${
        theme.isDarkMode ? "bg-darkMode-bg" : "white"
      }`}
    >
      <h2
        className={`text-center text-2xl font-bold mb-4 ${
          theme.isDarkMode ? "text-white" : "text-lightMode-text"
        }`}
      >
        Share a Meal
      </h2>

      {message && (
        <p className="bg-green-100 border border-green-500 text-green-700 px-4 py-2 rounded-md shadow-md mb-4">
          {message}
        </p>
      )}
      {error && (
        <p className="bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded-md shadow-md mb-4">
          Error: {error}
        </p>
      )}

      {fieldConfigs.map((field) => (
        <div className="mb-4" key={field.name}>
          <label
            htmlFor={field.name}
            className={`block text-lg font-medium mb-1 ${
              theme.isDarkMode ? "text-white" : "text-lightMode-text"
            }`}
          >
            {field.label}:
          </label>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              id={field.name}
              value={mealData[field.name]}
              onChange={handleChange}
              required={field.required}
              className={`w-full px-3 py-2 border rounded-md ${
                theme.isDarkMode ? "border-gray-700" : "border-lightMode-hover"
              } focus:outline-none focus:ring-2 focus:ring-lightMode-hover transition duration-200`}
            ></textarea>
          ) : (
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={mealData[field.name]}
              onChange={handleChange}
              required={field.required}
              step={field.step}
              className={`w-full px-3 py-2 border rounded-md ${
                theme.isDarkMode ? "border-gray-700" : "border-lightMode-hover"
              } focus:outline-none focus:ring-2 focus:ring-lightMode-hover 
              } transition duration-200`}
            />
          )}
        </div>
      ))}

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={`mb-4 border rounded-md px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 ${
            theme.isDarkMode ? "border-white" : "border-lightMode-hover"
          } focus:ring-primary`}
        />
        {selectedImage && (
          <div>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-48 h-48 object-cover mb-4 rounded-md border border-lightMode-hover"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md ${
          loading
            ? "cursor-not-allowed"
            : theme.isDarkMode
            ? "bg-darkMode-darkBG hover:bg-darkMode-hover transition duration-200 text-darkMode-text"
            : "bg-lightMode-bg hover:bg-lightMode-hover transition duration-200 text-lightMode-text"
        }`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Share a Meal"}
      </button>
    </form>
  );
};

export default MealForm;
