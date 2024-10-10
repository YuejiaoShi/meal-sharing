import express from "express";
import DBConnection from "../database_client.js";
import handleFormatDateOrDatetime from "../utils/helper.js";

const meals = express.Router();

//  ----------- /api/meals | GET | Returns all meals -----------
meals.get("/", async (req, res) => {
  try {
    const {
      maxPrice,
      availableReservations,
      title,
      dateAfter,
      dateBefore,
      limit,
      sortKey,
      sortDir,
    } = req.query;
    let meals = await DBConnection("Meal").select("*");
    let query = DBConnection("Meal")
      .leftJoin(
        DBConnection.raw(`(
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
        "Meal.description",
        "Meal.location",
        "Meal.image",
        "Meal.created_date",
        DBConnection.raw("COALESCE(Reserved.total_guests, 0) AS total_guests"),
        "Meal.price",
        "Meal.when",
        DBConnection.raw(
          "Meal.max_reservations - COALESCE(Reserved.total_guests, 0) AS available_seats"
        )
      );

    // maxPrice Parameter
    if (maxPrice) {
      query = query.where("Meal.price", "<=", maxPrice);
    }

    // availableReservations Parameter
    // if (availableReservations === undefined) {
    //   return res.status(400).json({
    //     error: "Invalid value for 'availableReservations' query parameter",
    //   });
    // }
    if (availableReservations === "true") {
      query = query.where(
        DBConnection.raw(
          "COALESCE(Reserved.total_guests, 0) < Meal.max_reservations"
        )
      );
    }
    if (availableReservations === "false") {
      query = query.whereRaw(
        "COALESCE(Reserved.total_guests, 0) >= Meal.max_reservations"
      );
    }

    // title Parameter
    if (title) {
      query = query.where("Meal.title", "like", `%${title}%`);
    }

    // dateAfter Parameter
    if (dateAfter) {
      const formattedDateAfter = handleFormatDateOrDatetime(
        "dateAfter",
        dateAfter,
        "date",
        res
      );
      if (!formattedDateAfter) {
        return;
      }
      query = query.where("Meal.when", ">", new Date(formattedDateAfter));
    }
    // dateBefore Parameter
    if (dateBefore) {
      const formattedDateBefore = handleFormatDateOrDatetime(
        "dateBefore",
        dateBefore,
        "date",
        res
      );
      if (!formattedDateBefore) {
        return;
      }
      query = query.where("Meal.when", "<", new Date(formattedDateBefore));
    }

    // limit Parameter
    if (limit) {
      const parsedLimit = parseInt(limit);
      if (parsedLimit > 0) {
        query = query.limit(parsedLimit);
      } else {
        return res.status(400).json({
          error: "Invalid value for 'limit'. Must be a positive integer.",
        });
      }
    }

    // sortKey & sortDir Parameters
    if (sortKey || sortDir) {
      if (sortDir && !sortKey) {
        return res.status(400).json({
          error: "sortDir must work with a soreKey.",
        });
      }
      const validSortKeys = ["when", "max_reservations", "price"];
      const validSortDirs = ["ASC", "DESC"];

      const FormattedSortDir = sortDir ? sortDir.toUpperCase() : "ASC";
      if (
        validSortKeys.includes(sortKey) &&
        validSortDirs.includes(FormattedSortDir)
      ) {
        query = query.orderBy(sortKey, FormattedSortDir);
      } else {
        return res.status(400).json({
          error: "Invalid value for sort key or direction.",
        });
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
    const [newMeal] = await DBConnection("Meal").insert({
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
    const meal = await DBConnection("Meal")
      .leftJoin(
        DBConnection.raw(`(
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
        "Meal.description",
        "Meal.location",
        "Meal.image",
        "Meal.created_date",
        "Meal.price",
        "Meal.when",
        DBConnection.raw("COALESCE(Reserved.total_guests, 0) AS total_guests"),
        DBConnection.raw(
          "GREATEST(Meal.max_reservations - COALESCE(Reserved.total_guests, 0), 0) AS available_seats"
        )
      )
      .where("Meal.id", id);

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
  const { meal_id, created_date, when, ...otherFields } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  const fieldsToUpdate = { ...otherFields };

  if (meal_id !== undefined) {
    fieldsToUpdate.meal_id = meal_id;
  }
  if (when !== undefined) {
    fieldsToUpdate.when = handleFormatDateOrDatetime(
      "when",
      when,
      "datetime",
      res
    );
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
    const updateMeal = await DBConnection("Meal")
      .where("id", id)
      .update(fieldsToUpdate);

    if (updateMeal > 0) {
      res.status(200).json({
        message: "Meal updated :)",
        meal: await DBConnection("Meal").where("id", id),
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
    const deletedMeal = await DBConnection("Meal").where("id", id).del();

    if (!deletedMeal) {
      return res.status(404).send("Meal Not Found");
    }
    return res.status(200).send("Meal deleted :)");
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
// ----------- /api/meals/:id | DELETE | Deletes the meal by id -----------

//  ------- /api/meals/:meal_id/reviews | GET | Returns all reviews for a specific meal. -----------
meals.get("/:meal_id/reviews", async (req, res) => {
  const { meal_id } = req.params;
  try {
    const reviews = await DBConnection("Review").select("*").where({ meal_id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//  ------- /api/meals/:meal_id/reviews | GET | Returns all reviews for a specific meal. -----------

export default meals;
