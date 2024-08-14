import express from "express";
import knex from "../database_client.js";

const reservations = express.Router();

//  ----------- /api/reservations | GET | Returns all Reservations -----------
reservations.get("/", async (req, res) => {
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
reservations.post("/", async (req, res) => {
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
// ----------- /api/reservations | POST | Adds a new reservation to the database -----------

// ----------- /api/reservations/:id | GET | Returns the reservation by id -----------
reservations.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send("Invalid Id");
  }
  try {
    const reservation = await knex("Reservation").where("id", id);

    if (reservation) {
      return res.json(reservation);
    } else {
      return res.status(404).send("Reservation Not Found");
    }
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
// ----------- /api/reservations/:id | GET | Returns the reservation by id -----------

// ----------- /api/reservations/:id | PUT | Updates the reservation by id -----------
reservations.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    number_of_guests,
    meal_id,
    created_date,
    contact_phonenumber,
    contact_name,
    contact_email,
  } = req.body;

  const updateFields = {};

  if (number_of_guests !== undefined)
    updateFields.number_of_guests = number_of_guests;
  if (meal_id !== undefined) updateFields.meal_id = meal_id;
  if (contact_phonenumber !== undefined)
    updateFields.contact_phonenumber = contact_phonenumber;
  if (contact_name !== undefined) updateFields.contact_name = contact_name;
  if (contact_email !== undefined) updateFields.contact_email = contact_email;
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
    const meal = await knex("Meal").where({ id: meal_id }).first();
    if (!meal) {
      return res
        .status(404)
        .json({ error: "Invalid meal_id. Meal does not exist." });
    }

    const updatedReservation = await knex("Reservation")
      .where("id", id)
      .update(updateFields);

    if (updatedReservation > 0) {
      res.status(200).json({
        message: "Reservation updated :)",
        reservation: updatedReservation,
      });
    } else {
      res.status(404).json({ error: "Reservation Not Found" });
    }
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
// ----------- /api/reservations/:id | PUT | Updates the reservation by id -----------

// ----------- /api/reservations/:id | DELETE | Deletes the reservation by id -----------
reservations.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send("Invalid Id");
  }
  try {
    const deletedReservation = await knex("Reservation").where("id", id).del();

    if (deletedReservation) {
      return res.status(200).send("Reservation deleted :)");
    } else {
      return res.status(404).send("Reservation Not Found");
    }
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
// ----------- /api/reservations/:id | DELETE | Deletes the reservation by id -----------
export default reservations;
