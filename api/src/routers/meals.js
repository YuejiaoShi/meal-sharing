import express from "express";
import DBConnection from "../database_client.js";
import handleFormatDateOrDatetime from "../utils/helper.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "..", "frontend", "public", "meals");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });

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
    let mealsData = await DBConnection("meal").select("*");
    let query = DBConnection("meal")
      .leftJoin(
        DBConnection.raw(`(
        SELECT meal_id, COALESCE(SUM(number_of_guests), 0) AS total_guests
        FROM reservation
        GROUP BY meal_id
      ) AS reserved`),
        "meal.id",
        "reserved.meal_id"
      )
      .select(
        "meal.id",
        "meal.title",
        "meal.max_reservations",
        "meal.description",
        "meal.location",
        "meal.image",
        "meal.created_date",
        DBConnection.raw("COALESCE(reserved.total_guests, 0) AS total_guests"),
        "meal.price",
        "meal.when",
        DBConnection.raw(
          "meal.max_reservations - COALESCE(reserved.total_guests, 0) AS available_seats"
        )
      );

    // maxPrice Parameter
    if (maxPrice) {
      query = query.where("meal.price", "<=", maxPrice);
    }

    if (availableReservations === "true") {
      query = query.where(
        DBConnection.raw(
          "COALESCE(reserved.total_guests, 0) < meal.max_reservations"
        )
      );
    }
    if (availableReservations === "false") {
      query = query.whereRaw(
        "COALESCE(reserved.total_guests, 0) >= meal.max_reservations"
      );
    }

    // title Parameter
    if (title) {
      query = query.where("meal.title", "like", `%${title}%`);
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
      query = query.where("meal.when", ">", new Date(formattedDateAfter));
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
      query = query.where("meal.when", "<", new Date(formattedDateBefore));
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
          error: "sortDir must work with a sortKey.",
        });
      }
      const validSortKeys = ["id", "when", "max_reservations", "price"];
      const validSortDirs = ["ASC", "DESC"];

      const formattedSortDir = sortDir ? sortDir.toUpperCase() : "ASC";
      if (
        validSortKeys.includes(sortKey) &&
        validSortDirs.includes(formattedSortDir)
      ) {
        query = query.orderBy(sortKey, formattedSortDir);
      } else {
        return res.status(400).json({
          error: "Invalid value for sort key or direction.",
        });
      }
    }

    mealsData = await query;
    res.json(mealsData);
  } catch (error) {
    const errMessage = error.message;
    res.status(500).json({ error: errMessage });
  }
});
//  ----------- /api/meals | GET | Returns all meals -----------

// ----------- /api/meals | POST | Adds a new meal to the database -----------
meals.post("/", upload.single("image"), async (req, res) => {
  const { title, description, location, when, max_reservations, price } =
    req.body;

  const image = req.file;

  if (
    !title ||
    !description ||
    !location ||
    !max_reservations ||
    !price ||
    !when ||
    !image
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
        image: "file",
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
  const formattedCreatedDate = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    const [newMeal] = await DBConnection("meal").insert({
      title,
      description,
      location,
      when: formattedWhenDate,
      max_reservations,
      price,
      image: `/meals/${image.originalname}`,
      created_date: formattedCreatedDate,
    });

    res.status(201).json({
      message: `${title} was added :)`,
      id: newMeal,
      title,
      description,
      location,
      when: formattedWhenDate,
      max_reservations,
      price,
      image: `/meals/${image.originalname}`,
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
    const meal = await DBConnection("meal")
      .leftJoin(
        DBConnection.raw(`(
        SELECT meal_id, COALESCE(SUM(number_of_guests), 0) AS total_guests
        FROM reservation
        GROUP BY meal_id
      ) AS reserved`),
        "meal.id",
        "reserved.meal_id"
      )
      .select(
        "meal.id",
        "meal.title",
        "meal.max_reservations",
        "meal.description",
        "meal.location",
        "meal.image",
        "meal.created_date",
        "meal.price",
        "meal.when",
        DBConnection.raw("COALESCE(reserved.total_guests, 0) AS total_guests"),
        DBConnection.raw(
          "GREATEST(meal.max_reservations - COALESCE(reserved.total_guests, 0), 0) AS available_seats"
        )
      )
      .where("meal.id", id);

    if (meal.length > 0) {
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
    const updateMeal = await DBConnection("meal")
      .where("id", id)
      .update(fieldsToUpdate);

    if (updateMeal > 0) {
      res.status(200).json({
        message: "Meal updated :)",
        meal: await DBConnection("meal").where("id", id),
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
    const deletedMeal = await DBConnection("meal").where("id", id).del();

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
    const reviews = await DBConnection("review").select("*").where({ meal_id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//  ------- /api/meals/:meal_id/reviews | GET | Returns all reviews for a specific meal. -----------

export default meals;
