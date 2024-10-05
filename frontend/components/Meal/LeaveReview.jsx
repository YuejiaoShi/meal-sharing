import { useState } from "react";
import axios from "axios";

function LeaveReview({ isReviewFormOpen, setReviewFormOpen, meal_id }) {
  const [reviewData, setReviewData] = useState({
    title: "",
    rating: 5,
    comment: "",
  });
  const [submitError, setSubmitError] = useState(null);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewData.rating || !reviewData.comment || !reviewData.title) {
      setSubmitError("Please fill out the title, rating, and comment fields.");
      return;
    }

    try {
      const reviewPayload = {
        title: reviewData.title,
        description: reviewData.comment,
        meal_id: meal_id,
        stars: reviewData.rating,
        created_date: new Date().toISOString().split("T")[0],
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
        reviewPayload
      );

      alert("Review submitted successfully!");
      setReviewData({ title: "", rating: 5, comment: "" });
      setReviewFormOpen(false);
    } catch (err) {
      console.error("Submission error:", err);
      const errorMsg = err.response?.data?.error || "Failed to submit review";
      setSubmitError(errorMsg);
    }
  };

  return (
    <div>
      <button
        onClick={() => setReviewFormOpen(!isReviewFormOpen)}
        className="bg-secondary py-2 px-6 rounded hover:bg-secondary-dark transition-colors duration-300 w-full mb-4"
      >
        {isReviewFormOpen ? "Cancel Review" : "Leave a Review"}
      </button>
      {isReviewFormOpen && (
        <form
          onSubmit={handleReviewSubmit}
          className="bg-gray-100 p-4 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={reviewData.rating}
              onChange={(e) =>
                setReviewData({ ...reviewData, rating: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={reviewData.title}
              onChange={(e) =>
                setReviewData({ ...reviewData, title: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Comment</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData({ ...reviewData, comment: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {submitError && (
            <div className="text-red-500 mb-4">{submitError}</div>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors duration-300"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}

export default LeaveReview;
