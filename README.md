# MealSharing

MealSharing is a dynamic web application designed for food enthusiasts to explore, manage, and share meals with others. Leveraging a RESTful API built with Node.js and Express, this app allows users to curate their meal experiences, make reservations, and leave reviews. Developed as a personal project, MealSharing showcases essential web development principles and best practices in API design.

## Live Demo

[<img src="./app/app/favicon.ico" alt="MealSharing logo" width="15"/>](https://meal-sharing-yjs.vercel.app/) [MealSharing](https://meal-sharing-yjs.vercel.app/)

## Technologies and Techniques Used

[<img alt="Node.js" src="https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" height="25">](https://nodejs.org/) JavaScript runtime for building the API.  
[<img alt="Express" src="https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white" height="25">](https://expressjs.com/) Web framework for creating the RESTful API.  
[<img alt="Next.js" src="https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white" height="25">](https://nextjs.org/) Framework for building the frontend application with React.  
[<img alt="MySQL" src="https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" height="25">](https://www.mysql.com/) Database management system used during development for database design.  
[<img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white" height="25">](https://www.postgresql.org/) Advanced database management system used during deployment.  
[<img alt="Tailwind CSS" src="https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" height="25">](https://tailwindcss.com/) Utility-first CSS framework for styling the application.  
[<img alt="PgAdmin4" src="https://img.shields.io/badge/-PgAdmin4-3D5B8E?style=flat-square&logo=postgresql&logoColor=white" height="25">](https://www.pgadmin.org/) Database management tool for handling PostgreSQL databases.  
[<img alt="Render" src="https://img.shields.io/badge/-Render.com-3B3B3B?style=flat-square&logo=render&logoColor=white" height="25">](https://render.com/) Platform for deploying the backend API.  
[<img alt="Vercel" src="https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" height="25">](https://vercel.com/) Platform for deploying the frontend application.

## Visual Overview

### Home page light mode

[<img src="./previewImgs/home-light.png" alt="Home page light mode" width="700"/>](./previewImgs/home-light.png)

### Home page dark mode

[<img src="./previewImgs/home-dark.png" alt="Home page dark mode" width="700"/>](./previewImgs/home-dark.png)

### Meal List page

[<img src="./previewImgs/meals.png" alt="Meals page light mode" width="700"/>](./previewImgs/meals.png)

### Meal Details page

[<img src="./previewImgs/meal-details.png" alt="Meal Details page" width="700"/>](./previewImgs/meal-details.png)

### Meal Reservation Modal

[<img src="./previewImgs/reservation-modal.png" alt="Meal Reservation Modal" width="700"/>](./previewImgs/reservation-modal.png)

### Leave Review

[<img src="./previewImgs/leave-review.png" alt="Leave Review page" width="700"/>](./previewImgs/leave-review.png)

### About Us page

[<img src="./previewImgs/about-us.png" alt="About Us page" width="700"/>](./previewImgs/about-us.png)

### Share Meal page

[<img src="./previewImgs/share-meal.png" alt="Share Meal page" width="700"/>](./previewImgs/share-meal.png)

### Footer

[<img src="./previewImgs/footer.png" alt="Footer section" width="700"/>](./previewImgs/footer.png)

## Features

- **Browse Meals**: Discover a wide variety of meals available in the app.
- **View Meal Details**: Access detailed information about selected meals, including ingredients and preparation instructions.
- **Make Reservations**: Reserve meals for specific dates and times.
- **Leave Reviews**: Share your experiences and rate meals to help others in the community.
- **Search Functionality**: Find meals by entering keywords related to the meal name or type.

## Components and Hooks

### Components

- **`App`**: The main component integrating all features and UI elements.
- **`MealsPage`**: Displays a list of meals, including search and filtering functionality.
- **`MealByID`**: Shows detailed information about a selected meal, including reviews and reservation options.
- **`MealsList`**: Renders a list of meals based on the fetched data.
- **`SearchBar`**: Provides an input field for searching meals.
- **`FilterControls`**: Allows users to sort and filter meals based on specific criteria.
- **`ReservationModal`**: A modal for handling meal reservations.
- **`LeaveReview`**: A component for users to submit reviews for meals.
- **`StarRating`**: A component for displaying and handling star ratings.
- **Filter Meals**: Easily filter meals based on different criteria, such as meal type, dietary preferences, or ratings.

## Getting started

> Before you start, make sure no other projects are running, in order to have the ports free.

To get started you'll need two terminals.

In the first terminal run the following commands:

```
cd api
cp .env-example .env
npm install
npm run dev
```

You can then test the API using [Postman](https://www.postman.com/) at [http://localhost:3001/api](http://localhost:3001/api).

In the second terminal run the following commands:

```
cd app
npm install
npm run dev
```

You can then open the web app at [http://localhost:3000](http://localhost:3000).
