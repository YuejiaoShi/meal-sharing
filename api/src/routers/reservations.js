import express from "express";
import knex from "../database_client.js";

const reservations = express.Router();

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

  const formattedCreatedDate = handleFormatDateOrDatetime(
    "created_date",
    created_date,
    "date",
    res
  );

  try {
    const meal = await knex("Meal").where({ id: meal_id }).first();
    if (!meal) {
      return res
        .status(404)
        .json({ error: "Invalid meal_id. Meal does not exist." });
    }

    const total_guests_before_post = Number(
      (
        await knex("Reservation")
          .where("meal_id", meal_id)
          .sum("number_of_guests as total_guests")
          .first()
      ).total_guests || 0
    );

    if (number_of_guests !== undefined) {
      if (total_guests_before_post + number_of_guests > meal.max_reservations) {
        return res
          .status(400)
          .json({ error: "Not enough available spots for this meal." });
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
    }
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
  const { meal_id, created_date, number_of_guests, ...otherFields } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  const fieldsToUpdate = { ...otherFields };

  if (meal_id !== undefined) {
    fieldsToUpdate.meal_id = meal_id;
  }
  if (created_date !== undefined) {
    fieldsToUpdate.created_date = handleFormatDateOrDatetime(
      "created_date",
      created_date,
      "date",
      res
    );
  }

  try {
    const meal = await knex("Meal").where({ id: meal_id }).first();
    if (!meal) {
      return res
        .status(404)
        .json({ error: "Invalid meal_id. Meal does not exist." });
    }

    const total_guests = Number(
      (
        await knex("Reservation")
          .where("meal_id", meal_id)
          .sum("number_of_guests as total_guests")
          .first()
      ).total_guests || 0
    );

    if (number_of_guests !== undefined) {
      if (total_guests + number_of_guests > meal.max_reservations) {
        return res
          .status(400)
          .json({ error: "Not enough available spots for this meal." });
      }
      fieldsToUpdate.number_of_guests = number_of_guests;
    }

    const updateReservation = await knex("Reservation")
      .where("id", id)
      .update(fieldsToUpdate);

    if (updateReservation > 0) {
      res.status(200).json({
        message: "Reservation updated :)",
        reservation: await knex("Reservation").where("id", id),
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
