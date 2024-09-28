"use client";

import { fetchMealById } from "@/context/fetchMealById";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import ReservationModal from "@/components/Meal/ReservationModal";

function MealByID() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

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
    return <div>Loading...</div>;
  }

  if (!meal) {
    return <div>Meal not found.</div>;
  }

  return (
    <div>
      <h1>{meal.title}</h1>
      <p>
        <strong>Description:</strong> {meal.description}
      </p>
      <p>
        <strong>Location:</strong> {meal.location}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {format(new Date(meal.when), "h:mm a, MMMM dd, yyyy")}
      </p>
      <p>
        <strong>Max Reservations:</strong> {meal.max_reservations}
      </p>
      <p>
        <strong>Price:</strong> ${meal.price}
      </p>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-primary text-white py-2 px-4 rounded"
      >
        Book Seat
      </button>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        mealId={id}
      />
    </div>
  );
}

export default MealByID;
