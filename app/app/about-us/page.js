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

      {/* Main Image */}
      <div className="mb-6">
        <img
          src="/AboutUsPage/meal-sharing.jpg"
          alt="Meal Sharing"
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      </div>

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

      {/* Service List with Alternating Layout */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row mb-4">
          <div className="md:w-1/2 flex items-center pr-4">
            <img
              src="/AboutUsPage/service1.jpg"
              alt="Meal Listings"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2 flex items-center">
            <div>
              <strong>Meal Listings:</strong> Browse a variety of meal offerings
              from different hosts, each with unique flavors and culinary
              styles.
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row mb-4">
          <div className="md:w-1/2 flex items-center">
            <div>
              <strong>Reservation System:</strong> Easily book your spot for a
              meal with our user-friendly reservation system, ensuring a
              seamless experience.
            </div>
          </div>
          <div className="md:w-1/2 flex items-center pl-4">
            <img
              src="/AboutUsPage/service2.jpg"
              alt="Reservation System"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row mb-4">
          <div className="md:w-1/2 flex items-center pr-4">
            <img
              src="/AboutUsPage/service3.jpg"
              alt="Reviews and Ratings"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2 flex items-center">
            <div>
              <strong>Reviews and Ratings:</strong> Share your dining
              experiences and read reviews from fellow food lovers to make
              informed choices.
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row mb-4">
          <div className="md:w-1/2 flex items-center">
            <div>
              <strong>Search Functionality:</strong> Find meals that match your
              taste preferences or dietary requirements using our powerful
              search tool.
            </div>
          </div>
          <div className="md:w-1/2 flex items-center pl-4">
            <img
              src="/AboutUsPage/service4.jpg"
              alt="Search Functionality"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row mb-4">
          <div className="md:w-1/2 flex items-center pr-4">
            <img
              src="/AboutUsPage/service5.jpg"
              alt="Dynamic Updates"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2 flex items-center">
            <div>
              <strong>Dynamic Updates:</strong> Enjoy real-time updates on
              available meals and reservations to stay informed about your
              dining options.
            </div>
          </div>
        </div>
      </div>

      <h2
        id="our-vision"
        className="text-3xl font-semibold mb-4 border-b-2 border-lightMode-bg pb-2"
      >
        Our Vision
      </h2>

      <div className="flex flex-col md:flex-row mb-6">
        <div className="md:w-1/2 flex items-center pr-4">
          <img
            src="/AboutUsPage/vision.jpg"
            alt="Our Vision"
            className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
          />
        </div>
        <div className="md:w-1/2 flex items-center">
          <p className="mb-6 text-lg">
            We envision a community where food brings people together, fostering
            connections, friendships, and cultural exchanges. Our platform not
            only showcases diverse cuisines but also encourages hosts and guests
            to share their stories, creating a vibrant tapestry of culinary
            experiences.
          </p>
        </div>
      </div>

      <h2
        id="join-us"
        className="text-3xl font-semibold mb-4 border-b-2 border-lightMode-bg pb-2"
      >
        Join Us
      </h2>

      <div className="flex flex-col md:flex-row mb-6">
        <div className="md:w-1/2 flex items-center pr-4">
          <img
            src="/AboutUsPage/join-us.jpg"
            alt="Join Us"
            className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
          />
        </div>
        <div className="md:w-1/2 flex items-center">
          <p className="mb-6 text-lg">
            Whether you're a meal enthusiast looking to try new dishes or a
            passionate cook wanting to share your culinary creations, our
            platform is the perfect place for you. Join our community and
            experience the joy of sharing meals with others!
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-4 border-b-2 border-lightMode-bg pb-2">
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
