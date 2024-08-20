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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ----------- /api/reviews | POST | Adds a new review to the database -----------

// ----------- /api/reviews/:id | GET | Returns the review by id -----------
reviews.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send("Invalid Id");
  }
  try {
    const review = await knex("Review").where("id", id);

    if (review) {
      return res.json(review);
    } else {
      return res.status(404).send("Review Not Found");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ----------- /api/reviews/:id | GET | Returns the review by id -----------

// ----------- /api/reviews/:id | PUT | Updates the review by id -----------
reviews.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, meal_id, stars, created_date } = req.body;

  const fieldsToUpdate = {};

  if (title !== undefined) {
    fieldsToUpdate.title = title;
  }

  if (description !== undefined) {
    fieldsToUpdate.description = description;
  }

  if (meal_id !== undefined) {
    fieldsToUpdate.meal_id = meal_id;
  }

  if (stars !== undefined) {
    fieldsToUpdate.stars = stars;
  }

  if (created_date !== undefined) {
    fieldsToUpdate.created_date = handleFormatDateOrDatetime(
      "created_date",
      created_date,
      "date",
      res
    );
  }
  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  try {
    const meal = await knex("Meal").where({ id: meal_id }).first();
    if (!meal) {
      return res
        .status(404)
        .json({ error: "Invalid meal_id. Meal does not exist." });
    }

    const updateReview = await knex("Review")
      .where("id", id)
      .update(fieldsToUpdate);

    if (updateReview > 0) {
      res.status(200).json({
        message: "Review updated :)",
        review: await knex("Review").where("id", id),
      });
    } else {
      res.status(404).json({ error: "Review Not Found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ----------- /api/reviews/:id | PUT | Updates the review by id -----------

export default reviews;
