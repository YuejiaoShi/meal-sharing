import express from "express";
import knex from "../database_client.js";

const meals = express.Router();

//  ----------- /api/meals | GET | Returns all meals -----------
meals.get("/", async (req, res) => {
  try {
    const meals = await knex("Meal").select("*");
    res.json(meals);
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
//  ----------- /api/meals | GET | Returns all meals -----------

// ----------- /api/meals | POST | Adds a new meal to the database -----------
meals.post("/", async (req, res) => {
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
      message: `${title} was added :)`,
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
// ----------- /api/meals | POST | Adds a new meal to the database -----------

// ----------- /api/meals/:id | GET | Returns the meal by id -----------
meals.get("/:id", async (req, res) => {
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
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
// ----------- /api/meals/:id | GET | Returns the meal by id -----------

// ----------- /api/meals/:id | PUT | Updates the meal by id -----------
meals.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    title,
    description,
    location,
    when,
    max_reservations,
    price,
    created_date,
  } = req.body;

  const fieldsToUpdate = {};

  if (title !== undefined) fieldsToUpdate.title = title;
  if (description !== undefined) fieldsToUpdate.description = description;
  if (location !== undefined) fieldsToUpdate.location = location;
  if (when !== undefined) {
    const parsedWhenDate = new Date(when);
    if (isNaN(parsedWhenDate.getTime())) {
      return res.status(400).json({
        error:
          "Invalid date format for 'when'. Use YYYY-MM-DD HH:MM:SS format.",
      });
    }
    fieldsToUpdate.when = parsedWhenDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  }
  if (max_reservations !== undefined)
    fieldsToUpdate.max_reservations = max_reservations;
  if (price !== undefined) fieldsToUpdate.price = price;
  if (created_date !== undefined) {
    const parsedCreatedDate = new Date(created_date);
    if (isNaN(parsedCreatedDate.getTime())) {
      return res.status(400).json({
        error: "Invalid date format for 'created_date'. Use YYYY-MM-DD format.",
      });
    }
    fieldsToUpdate.created_date = parsedCreatedDate.toISOString().slice(0, 10);
  }

  try {
    const updatedMeal = await knex("Meal").where("id", id).update(fieldsToUpdate);

    if (updatedMeal > 0) {
      res.status(200).json({
        message: "Meal updated :)",
        meal: updatedMeal,
      });
    } else {
      res.status(404).json({ error: "Meal Not Found" });
    }
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
// ----------- /api/meals/:id | PUT | Updates the meal by id -----------

// ----------- /api/meals/:id | DELETE | Deletes the meal by id -----------
meals.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send("Invalid Id");
  }
  try {
    const deletedMeal = await knex("Meal").where("id", id).del();

    if (deletedMeal) {
      return res.status(200).send("Meal deleted :)");
    } else {
      return res.status(404).send("Meal Not Found");
    }
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
// ----------- /api/meals/:id | DELETE | Deletes the meal by id -----------
export default meals;
