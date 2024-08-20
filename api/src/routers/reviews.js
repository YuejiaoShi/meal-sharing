import express from "express";
import knex from "../database_client.js";

const reviews = express.Router();

// Handle date or dateime formatting
function handleFormatDateOrDatetime(fieldToFormat, value, format, res) {
  const parsedDate = new Date(value);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      error: `Invalid date format for '${fieldToFormat}'. Use ${format === "date" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:MM:SS"} format.`,
    });
  }
  return parsedDate
    .toISOString()
    .slice(0, format === "date" ? 10 : 19)
    .replace("T", " ");
}

//  ----------- /api/reviews | GET | Returns all reviews -----------
reviews.get("/", async (req, res) => {
  try {
    const reviews = await knex("Review").select("*");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//  ----------- /api/reviews | GET | Returns all reviews -----------

// ----------- /api/reviews | POST | Adds a new review to the database -----------
reviews.post("/", async (req, res) => {
  const { title, description, meal_id, stars, created_date } = req.body;
  if (!title || !description || !meal_id || !stars || !created_date) {
    return res.status(400).json({
      error: "All fields are required for posting a review :(",
      requiredFields: {
        title: "string",
        description: "string",
        created_date: "date (YYYY-MM-DD)",
        meal_id: "integer",
        stars: "integer",
      },
    });
  }

  // Format created_date (date)
  const formattedCreatedDate = handleFormatDateOrDatetime(
    "created_date",
    created_date,
    "date",
    res
  );

  try {
    // Check if the provided meal_id exists in the Meal table
    const meal = await knex("Meal").where({ id: meal_id }).first();
    if (!meal) {
      return res
        .status(404)
        .json({ error: "Invalid meal_id. Meal does not exist." });
    }

    const [newReview] = await knex("Review").insert({
      title,
      description,
      meal_id,
      stars,
      created_date: formattedCreatedDate,
    });

    // Respond with the new added review
    res.status(201).json({
      message: `Review was added :)`,
      id: newReview,
      title,
      description,
      meal_id,
      stars,
      created_date: formattedCreatedDate,
    });
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
// ----------- /api/reviews | POST | Adds a new review to the database -----------

export default reviews;
