"use client";

import { fetchMealById } from "@/context/fetchMealById";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import ReservationModal from "@/components/Meal/ReservationModal";
import LeaveReview from "@/components/Meal/leaveReview";
import { useThemeContext } from "@/context/themeContext";

function MealByID() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReviewFormOpen, setReviewFormOpen] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      if (!id) return;
      try {
        const mealData = await fetchMealById(id);
        setMeal(mealData[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Meal not found.</div>
      </div>
    );
  }

  const theme = useThemeContext();

  return (
    <div
      className={`${
        theme.isDarkMode ? "bg-darkMode-bg text-darkMode-text" : ""
      } mt-4 max-w-2xl mx-auto p-6  shadow-lg rounded-lg`}
    >
      <img
        src={meal.image}
        alt={meal.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-4 text-gray-800">{meal.title}</h1>
      <p className=" mb-4">
        <strong>Description:</strong> {meal.description}
      </p>
      <p className=" mb-4">
        <strong>Location:</strong> {meal.location}
      </p>
      <p className=" mb-4">
        <strong>Date:</strong>{" "}
        {format(new Date(meal.when), "h:mm a, MMMM dd, yyyy")}
      </p>
      <p className=" mb-4">
        <strong>Max Reservations:</strong> {meal.max_reservations}
      </p>
      <p className=" mb-6">
        <strong>Price:</strong> ${meal.price}
      </p>

      <button
        onClick={() => setModalOpen(true)}
        className={`${
          theme.isDarkMode
            ? "bg-darkMode-darkBG text-darkMode-text hover:bg-darkMode-hover"
            : "bg-lightMode-bg text-lightMode-text hover:bg-lightMode-hover"
        } py-2 px-6 rounded transition-colors duration-300 w-full mb-4`}
      >
        Book Seat
      </button>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        mealId={id}
      />

      <LeaveReview
        isReviewFormOpen={isReviewFormOpen}
        setReviewFormOpen={setReviewFormOpen}
        meal_id={id}
      />
    </div>
  );
}

export default MealByID;
