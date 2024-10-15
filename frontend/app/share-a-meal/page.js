"use client"; // This makes the component a client component

import { useState } from "react";
import axios from "axios";
import { useThemeContext } from "@/context/themeContext";
import MealForm from "@/components/ShareAMeal/MealForm";

function ShareAMealPage() {
  const [mealData, setMealData] = useState({
    title: "",
    description: "",
    location: "",
    max_reservations: "",
    price: "",
    when: "",
    image: null,
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
      !image
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    for (const key in mealData) {
      if (key === "image") {
        formData.append(key, mealData.image);
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
            "Content-Type": "multipart/form-data",
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
        image: null,
      });
      setSelectedImage(null);
    } catch (err) {
      console.error("Error posting meal:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
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
