import express from "express";
import knex from "../database_client.js";

const Meals = express.Router();

Meals.get("/", async (req, res) => {
  try {
    const meals = await knex("Meal").select("*");
    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

Meals.post("/", async (req, res) => {
  const { title, description, location, when, max_reservations, price } =
    req.body;
  if (
    !title ||
    !description ||
    !location ||
    !when ||
    !max_reservations ||
    !price
  ) {
    return res.status(400).json({
      error: "All fields are required for posting a meal :(",
      requiredFields: {
        title: "string",
        description: "string",
        location: "string",
        when: "datetime",
        max_reservations: "integer",
        price: "decimal",
      },
    });
  }
  const parsedDate = new Date(when);
  if (isNaN(parsedDate.getTime())) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD HH:MM:SS format." });
  }

  const formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");
  try {
    const [newMeal] = await knex("Meal").insert({
      title,
      description,
      location,
      when: formattedDate,
      max_reservations,
      price,
    });

    // Respond with the new added meal
    res.status(201).json({
      message: `${title} is successfully added :)`,
      id: newMeal,
      title,
      description,
      location,
      when: formattedDate,
      max_reservations,
      price,
    });
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});

export default Meals;
