"use client"; // This makes the component a client component

import { useState } from "react";
import axios from "axios";
import { useThemeContext } from "@/context/themeContext";
import MealForm from "./MealForm"; // Adjust the import path as necessary

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
      <MealForm
        mealData={mealData}
        setMealData={setMealData}
        handleSubmit={handleSubmit}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        error={error}
        message={message}
        loading={loading}
      />
    </div>
  );
}

export default ShareAMealPage;
