// MealForm.js

import { useState } from "react";

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
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB.");
        return;
      }
      setSelectedImage(URL.createObjectURL(file)); // Use URL.createObjectURL for preview
      setMealData({ ...mealData, image: file }); // Set the file directly
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6"
    >
      <h2 className="text-center text-2xl font-bold mb-4">Share a Meal</h2>

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

      <div className="mb-4">
        <label htmlFor="title" className="block text-lg font-medium mb-1">
          Title:
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={mealData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-lg font-medium mb-1">
          Description:
        </label>
        <textarea
          name="description"
          id="description"
          value={mealData.description}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block text-lg font-medium mb-1">
          Location:
        </label>
        <input
          type="text"
          name="location"
          id="location"
          value={mealData.location}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="max_reservations"
          className="block text-lg font-medium mb-1"
        >
          Max Reservations:
        </label>
        <input
          type="number"
          name="max_reservations"
          id="max_reservations"
          value={mealData.max_reservations}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="block text-lg font-medium mb-1">
          Price:
        </label>
        <input
          type="number"
          name="price"
          id="price"
          value={mealData.price}
          onChange={handleChange}
          step="0.01"
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="when" className="block text-lg font-medium mb-1">
          When (YYYY-MM-DD HH:MM:SS):
        </label>
        <input
          type="datetime-local"
          name="when"
          id="when"
          value={mealData.when}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
        {selectedImage && (
          <div>
            <p>Selected Image Preview:</p>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-48 h-48 object-cover mb-4 rounded-md border"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 text-white rounded-md ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Share a Meal"}
      </button>
    </form>
  );
};

export default MealForm;
