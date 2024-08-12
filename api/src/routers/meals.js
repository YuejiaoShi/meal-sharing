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
  const {
    title,
    description,
    location,
    when,
    max_reservations,
    price,
    created_date,
  } = req.body;
  if (
    !title ||
    !description ||
    !location ||
    !when ||
    !max_reservations ||
    !price ||
    !created_date
  ) {
    return res.status(400).json({
      error: "All fields are required for posting a meal :(",
      requiredFields: {
        title: "string",
        description: "string",
        location: "string",
        when: "datetime (YYYY-MM-DD HH:MM:SS)",
        max_reservations: "integer",
        price: "decimal",
        created_date: "date (YYYY-MM-DD)",
      },
    });
  }

  // Format when (datetime) and created_date (date)
  const parsedWhenDate = new Date(when);
  if (isNaN(parsedWhenDate.getTime())) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD HH:MM:SS format." });
  }
  const formattedWhenDate = parsedWhenDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const parsedCreatedDate = new Date(created_date);
  if (isNaN(parsedCreatedDate.getTime())) {
    return res
      .status(400)
      .json({ error: "Invalid 'created_date' format. Use YYYY-MM-DD format." });
  }
  const formattedCreatedDate = parsedCreatedDate.toISOString().slice(0, 10);

  try {
    const [newMeal] = await knex("Meal").insert({
      title,
      description,
      location,
      when: formattedWhenDate,
      max_reservations,
      price,
      created_date: formattedCreatedDate,
    });

    // Respond with the new added meal
    res.status(201).json({
      status: `${title} is successfully added :)`,
      id: newMeal,
      title,
      description,
      location,
      when: formattedWhenDate,
      max_reservations,
      price,
      created_date: formattedCreatedDate,
    });
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});

Meals.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send("Invalid Id");
  }
  try {
    const meal = await knex("Meal").where("id", id);

    if (meal) {
      return res.json(meal);
    } else {
      return res.status(404).send("Meal Not Found");
    }
  } catch (err) {
    console.error(err.message);
  }
});

export default Meals;
