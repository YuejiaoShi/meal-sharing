"use client";

import { fetchMealById } from "@/lib/fetchMealById";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import ReservationModal from "@/components/Meal/ReservationModal";
import LeaveReview from "@/components/Meal/leaveReview";
import { useThemeContext } from "@/context/themeContext";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { fetchReviewsById } from "@/lib/fetchReviewsById";

function MealByID() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

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

    // update meal information every 5 seconds
    const intervalId = setInterval(fetchMeal, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await fetchReviewsById(id);

        setReviews(reviewsData);
      } catch (error) {
        setError(err.message);
      }
    };

    if (id) {
      fetchReviews();
    }
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

  const displayStars = (rating) => {
    const maxStars = 5;
    const stars = [];

    for (let i = 0; i < rating; i++) {
      stars.push(
        <StarIcon key={`full-${i}`} className="h-5 w-5 text-yellow-400" />
      );
    }

    for (let i = rating; i < maxStars; i++) {
      stars.push(
        <StarBorderIcon
          key={`empty-${i}`}
          className="h-5 w-5 text-yellow-400"
        />
      );
    }

    return stars;
  };

  const theme = useThemeContext();

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => {
      return acc + review.stars;
    }, 0);
    console.log(totalRating);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(reviews);

  return (
    <div
      className={`${
        theme.isDarkMode ? "bg-darkMode-hover text-darkMode-text" : ""
      } mt-4 max-w-4xl mx-auto p-6 shadow-lg rounded-lg`}
    >
      <img
        src={meal.image}
        alt={meal.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="flex justify-between items-center text-3xl font-bold mb-4">
        <span className="mr-2">{meal.title}</span>
        <span className="text-xl mr-2 font-semibold text-yellow-500">
          &#9733; {averageRating} / 5.0
        </span>
      </h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="w-full sm:w-2/3">
          <p className="mb-4">{meal.description}</p>
          <p className="mb-4">
            <strong>Max Reservation: </strong>
            {meal.max_reservations}
          </p>
          <p className="mb-4">
            <strong>Location:</strong> {meal.location}
          </p>
          <p className="mb-4">
            <strong>Price:</strong> {meal.price} DKK
          </p>
        </div>

        <div className="flex flex-col items-center justify-center mx-auto w-full sm:w-1/3 border-orange-300 border-dashed border-2 rounded-2xl mb-5">
          <p
            className={`mt-4 mb-2 ${
              meal.available_seats <= 0 ? "text-red-500" : ""
            }`}
          >
            <strong>Available Seats: {meal.available_seats}</strong>
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className={`${
              theme.isDarkMode
                ? "bg-darkMode-darkBG text-darkMode-text hover:bg-darkMode-bg"
                : "bg-lightMode-bg text-lightMode-text hover:bg-lightMode-hover"
            } py-2 px-6 rounded-full transition-colors duration-300 mb-4`}
          >
            Book Seat
          </button>
        </div>
      </div>
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

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li
                key={review.id}
                className={`mb-4 p-4 rounded-lg shadow ${
                  theme.isDarkMode
                    ? "bg-darkMode-bg text-darkMode-text"
                    : "bg-gray-100"
                }`}
              >
                <h3 className="font-bold">{review.title}</h3>
                <p className="text-sm">
                  {format(new Date(review.created_date), "MMMM d, yyyy")}
                </p>
                <p className="mt-2">{review.description}</p>

                <span className="flex items-center mt-2">
                  {displayStars(review.stars)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default MealByID;
