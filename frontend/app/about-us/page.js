"use client";

import React from "react";
import { useThemeContext } from "@/context/themeContext";

const AboutUs = () => {
  const theme = useThemeContext();

  return (
    <div
      className={`${
        theme.isDarkMode
          ? "bg-darkMode-bg text-darkMode-text"
          : "bg-white text-lightMode-text"
      } p-8 max-w-5xl mx-auto rounded-lg shadow-lg mt-0 lg:mt-10 lg:mb-8 border border-lightMode-bg shadow-lightMode-bg transition-all duration-300`}
    >
      <h1 className="text-4xl font-bold mb-6 text-center underline decoration-lightMode-bg decoration-3">
        About Us
      </h1>
      <p className="mb-6 text-lg">
        Welcome to our meal-sharing platform, where food enthusiasts can
        connect, share, and enjoy delicious meals together. Our mission is to
        bring people together through food and create memorable dining
        experiences.
      </p>
      <h2
        id="our-services"
        className="text-3xl font-semibold mb-4 border-b-2 border-lightMode-bg pb-2"
      >
        Our Services
      </h2>
      <ul className="list-disc list-inside mb-6 pl-5">
        <li>
          <strong>Meal Listings:</strong> Browse a variety of meal offerings
          from different hosts, each with unique flavors and culinary styles.
        </li>
        <li>
          <strong>Reservation System:</strong> Easily book your spot for a meal
          with our user-friendly reservation system, ensuring a seamless
          experience.
        </li>
        <li>
          <strong>Reviews and Ratings:</strong> Share your dining experiences
          and read reviews from fellow food lovers to make informed choices.
        </li>
        <li>
          <strong>Search Functionality:</strong> Find meals that match your
          taste preferences or dietary requirements using our powerful search
          tool.
        </li>
        <li>
          <strong>Dynamic Updates:</strong> Enjoy real-time updates on available
          meals and reservations to stay informed about your dining options.
        </li>
      </ul>
      <h2
        id="our-vision"
        className="text-3xl font-semibold mb-4 border-b-2 border-lightMode-bg pb-2"
      >
        Our Vision
      </h2>
      <p className="mb-6 text-lg">
        We envision a community where food brings people together, fostering
        connections, friendships, and cultural exchanges. Our platform not only
        showcases diverse cuisines but also encourages hosts and guests to share
        their stories, creating a vibrant tapestry of culinary experiences.
      </p>
      <h2 className="text-3xl font-semibold mb-4 border-b-2 border-lightMode-bg pb-2">
        Join Us
      </h2>
      <p className="mb-6 text-lg">
        Whether you're a meal enthusiast looking to try new dishes or a
        passionate cook wanting to share your culinary creations, our platform
        is the perfect place for you. Join our community and experience the joy
        of sharing meals with others!
      </p>
      <h2
        id="join-us"
        className="text-3xl font-semibold mb-4 border-b-2 border-lightMode-bg pb-2"
      >
        Contact Us
      </h2>
      <p className="text-lg">
        If you have any questions, feedback, or suggestions, feel free to reach
        out to us at
        <a
          href="mailto:support@mealsharing.com"
          className="text-blue-600 underline hover:text-blue-800 transition duration-200 ml-1"
        >
          info@mealsharing.com
        </a>
        . We’d love to hear from you!
      </p>
    </div>
  );
};

export default AboutUs;
