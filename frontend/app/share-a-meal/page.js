"use client"; // This makes the component a client component

import { useState } from "react";
import axios from "axios";
import { useThemeContext } from "@/context/themeContext";

function ShareAMealPage() {
  const [mealData, setMealData] = useState({
    title: "",
    description: "",
    location: "",
    max_reservations: "",
    price: "",
    when: "", // User input for when
    image: null, // Added for image file
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useThemeContext();
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage("");

    // Check if all required fields are filled
    const {
      title,
      description,
      location,
      max_reservations,
      price,
      when,
      image,
    } = mealData;

    if (
      !title ||
      !description ||
      !location ||
      !max_reservations ||
      !price ||
      !when ||
      !image // Ensure image is included
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    // Create FormData
    const formData = new FormData();
    for (const key in mealData) {
      if (key === "image") {
        formData.append(key, mealData.image); // Append the file directly
      } else {
        formData.append(key, mealData[key]);
      }
    }

    // Log the FormData contents
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`); // Ensure all fields are present and correct
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/meals`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set correct header for FormData
          },
        }
      );
      setMessage(response.data.message);
      setMealData({
        title: "",
        description: "",
        location: "",
        max_reservations: "",
        price: "",
        when: "",
        image: null, // Reset the image as well
      });
      setSelectedImage(null);
    } catch (err) {
      console.error("Error posting meal:", err); // Log the complete error
      if (err.response) {
        console.error("Response data:", err.response.data); // Log response data
        setError(err.response.data.error || "Something went wrong.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-center text-2xl font-bold mb-4">Share a Meal</h2>

      {message && (
        <p className="bg-green-100 border border-green-500 text-green-700 px-4 py-2 rounded-md shadow-md">
          {message}
        </p>
      )}
      {error && (
        <p className="bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded-md shadow-md">
          Error: {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        {/* Input fields */}
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
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-lg font-medium mb-1"
          >
            Description:
          </label>
          <textarea
            name="description"
            id="description"
            value={mealData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
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
                className="w-48 h-48 object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-md ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : theme.isDarkMode
              ? "bg-darkMode-bg hover:bg-darkMode-hover"
              : "bg-lightMode-bg hover:bg-lightMode-hover"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Share a Meal"}
        </button>
      </form>
    </div>
  );
}

export default ShareAMealPage;
