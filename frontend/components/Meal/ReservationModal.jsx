import { useState } from "react";
import axios from "axios";
import { useThemeContext } from "@/context/themeContext";

const ReservationModal = ({ isOpen, onClose, mealId }) => {
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [contactPhonenumber, setContactPhonenumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (numberOfGuests <= 0) {
      setError("Number of guests must be at least 1.");
      return;
    }

    const reservationData = {
      number_of_guests: parseInt(numberOfGuests),
      meal_id: mealId,
      created_date: new Date().toISOString().split("T")[0],
      contact_phonenumber: contactPhonenumber,
      contact_name: contactName,
      contact_email: contactEmail,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations`,
        reservationData
      );
      alert(response.data.message);

      setNumberOfGuests("");
      setContactPhonenumber("");
      setContactName("");
      setContactEmail("");
      onClose();
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "An unknown error occurred while making the reservation.";
      setError(errorMessage);
      alert("Error: " + errorMessage);
    }
  };

  if (!isOpen) return null;

  const theme = useThemeContext();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div
        className={`${
          theme.isDarkMode
            ? "bg-darkMode-hover text-darkMode-text"
            : "bg-white text-lightMode-text"
        }  rounded-lg shadow-lg w-11/12 md:w-1/3 py-4 px-6`}
      >
        <div className="flex flex-col items-end h-6 m-0 p-0">
          <p
            className="cursor-pointer text-3xl  hover:text-red-600 mb-0"
            onClick={onClose}
          >
            &times;
          </p>
        </div>
        <h2 className="text-xl font-semibold mb-4">Make a Reservation</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="number_of_guests" className="block ">
              Number of Guests:
            </label>
            <input
              type="number"
              id="number_of_guests"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
              required
              min="1"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact_phonenumber" className="block ">
              Phone Number:
            </label>
            <input
              type="tel"
              id="contact_phonenumber"
              value={contactPhonenumber}
              onChange={(e) => setContactPhonenumber(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact_name" className="block">
              Name:
            </label>
            <input
              type="text"
              id="contact_name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact_email" className="block ">
              Email:
            </label>
            <input
              type="email"
              id="contact_email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className={`${
              theme.isDarkMode
                ? "bg-darkMode-darkBG text-darkMode-text hover:bg-darkMode-bg"
                : "bg-lightMode-bg text-lightMode-text hover:bg-lightMode-hover"
            } py-2 px-4 rounded`}
          >
            Submit Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
