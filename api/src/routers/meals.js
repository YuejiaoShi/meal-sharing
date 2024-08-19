import express from "express";
import knex from "../database_client.js";

const meals = express.Router();

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

//  ----------- /api/meals | GET | Returns all meals -----------
meals.get("/", async (req, res) => {
  try {
    const { maxPrice, availableReservations } = req.query;
    let meals = await knex("Meal").select("*");
    let query = knex("Meal")
      .leftJoin(
        knex.raw(`(
        SELECT meal_id, COALESCE(SUM(number_of_guests), 0) AS total_guests
        FROM Reservation
        GROUP BY meal_id
      ) AS Reserved`),
        "Meal.id",
        "Reserved.meal_id"
      )
      .select(
        "Meal.id",
        "Meal.title",
        "Meal.max_reservations",
        knex.raw("COALESCE(Reserved.total_guests, 0) AS total_guests"),
        "Meal.price"
      );

    if (maxPrice) {
      query = query.where("Meal.price", "<=", maxPrice);
    }

    if (availableReservations !== undefined) {
      if (availableReservations === "true") {
        query = query.where(
          knex.raw("COALESCE(Reserved.total_guests, 0) < Meal.max_reservations")
        );
      } else if (availableReservations === "false") {
        query = query.whereRaw(
          "COALESCE(Reserved.total_guests, 0) >= Meal.max_reservations"
        );
      }
    }
    meals = await query;
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

  const formattedWhenDate = handleFormatDateOrDatetime(
    "when",
    when,
    "datetime",
    res
  );

  const formattedCreatedDate = handleFormatDateOrDatetime(
    "created_date",
    created_date,
    "date",
    res
  );

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

  if (title !== undefined) {
    fieldsToUpdate.title = title;
  }
  if (description !== undefined) {
    fieldsToUpdate.description = description;
  }
  if (location !== undefined) {
    fieldsToUpdate.location = location;
  }
  if (when !== undefined) {
    fieldsToUpdate.when = handleFormatDateOrDatetime(
      "when",
      when,
      "datetime",
      res
    );
  }
  if (max_reservations !== undefined) {
    fieldsToUpdate.max_reservations = max_reservations;
  }
  if (price !== undefined) {
    fieldsToUpdate.price = price;
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
    const updateMeal = await knex("Meal")
      .where("id", id)
      .update(fieldsToUpdate);

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
