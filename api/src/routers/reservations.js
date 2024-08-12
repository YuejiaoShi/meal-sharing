import express from "express";
import knex from "../database_client.js";

const Reservations = express.Router();

//  ----------- /api/reservations | GET | Returns all Reservations -----------
Reservations.get("/", async (req, res) => {
  try {
    const reservations = await knex("Reservation").select("*");
    res.json(reservations);
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
//  ----------- /api/reservations | GET | Returns all Reservations -----------

// ----------- /api/reservations | POST | Adds a new Reservation to the database -----------
Reservations.post("/", async (req, res) => {
  const {
    number_of_guests,
    meal_id,
    created_date,
    contact_phonenumber,
    contact_name,
    contact_email,
  } = req.body;
  if (
    !number_of_guests ||
    !meal_id ||
    !created_date ||
    !contact_phonenumber ||
    !contact_name ||
    !contact_email
  ) {
    return res.status(400).json({
      error: "All fields are required for posting a reservation :(",
      requiredFields: {
        number_of_guests: "integer",
        meal_id: "integer",
        created_date: "date (YYYY-MM-DD)",
        contact_phonenumber: "string",
        contact_name: "string",
        contact_email: "string",
      },
    });
  }

  // Format created_date (date)
  const parsedCreatedDate = new Date(created_date);
  if (isNaN(parsedCreatedDate.getTime())) {
    return res
      .status(400)
      .json({ error: "Invalid 'created_date' format. Use YYYY-MM-DD format." });
  }
  const formattedCreatedDate = parsedCreatedDate.toISOString().slice(0, 10);

  try {
    // Check if the provided meal_id exists in the Meal table
    const meal = await knex("Meal").where({ id: meal_id }).first();
    if (!meal) {
      return res
        .status(404)
        .json({ error: "Invalid meal_id. Meal does not exist." });
    }

    const [newReservation] = await knex("Reservation").insert({
      number_of_guests,
      meal_id,
      created_date: formattedCreatedDate,
      contact_phonenumber,
      contact_name,
      contact_email,
    });

    // Respond with the new added reservation
    res.status(201).json({
      message: `Reservation was added :)`,
      id: newReservation,
      number_of_guests,
      meal_id,
      created_date: formattedCreatedDate,
      contact_phonenumber,
      contact_name,
      contact_email,
    });
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
// ----------- /api/meals | POST | Adds a new meal to the database -----------

// ----------- /api/meals/:id | GET | Returns the meal by id -----------
Reservations.get("/:id", async (req, res) => {
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
Reservations.put("/:id", async (req, res) => {
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

  const updateFields = {};

  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (location !== undefined) updateFields.location = location;
  if (when !== undefined) {
    const parsedWhenDate = new Date(when);
    if (isNaN(parsedWhenDate.getTime())) {
      return res.status(400).json({
        error:
          "Invalid date format for 'when'. Use YYYY-MM-DD HH:MM:SS format.",
      });
    }
    updateFields.when = parsedWhenDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  }
  if (max_reservations !== undefined)
    updateFields.max_reservations = max_reservations;
  if (price !== undefined) updateFields.price = price;
  if (created_date !== undefined) {
    const parsedCreatedDate = new Date(created_date);
    if (isNaN(parsedCreatedDate.getTime())) {
      return res.status(400).json({
        error: "Invalid date format for 'created_date'. Use YYYY-MM-DD format.",
      });
    }
    updateFields.created_date = parsedCreatedDate.toISOString().slice(0, 10);
  }

  try {
    const updateMeal = await knex("Meal").where("id", id).update(updateFields);

    if (updateMeal > 0) {
      res.status(200).json({
        message: "Meal updated :)",
        meal: await knex("Meal").where("id", id),
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
Reservations.delete("/:id", async (req, res) => {
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
export default Reservations;
