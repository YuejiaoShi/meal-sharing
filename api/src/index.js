import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// import nestedRouter from "./routers/nested.js";
import knex from "knex";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

apiRouter.get("/", async (req, res) => {
  res.json({
    hello: "Welcome to Yuejiao's Restaurant API!",
    instruction: "Explore our meal offerings through the following routes:",
    routes: {
      "/api/future-meals": "Meals scheduled for the future.",
      "/api/past-meals": "Meals that have already occurred.",
      "/api/all-meals": "All meals sorted by ID.",
      "/api/first-meal": "The meal with the smallest ID.",
      "/api/last-meal": "The meal with the largest ID.",
    },
  });
});

apiRouter.get("/all-meals", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM Meal ORDER BY id");
    // In MySQL, data is in the first element of the result
    res.json(meals[0]);
  } catch (error) {
    console.error("Error fetching all meals:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

apiRouter.get("/future-meals", async (req, res) => {
  try {
    // MySQL's NOW() func could get the current date and time
    const meals = await knex.raw("SELECT * FROM Meal WHERE `when` > NOW()");
    res.json(meals[0]); // For MySQL, data is in the first element of the result
  } catch (error) {
    console.error("Error fetching future meals:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

apiRouter.get("/first-meals", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id ASC LIMIT 1");
    const meal = result[0][0];
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).send("No meals found :(");
    }
  } catch (error) {
    console.error("Error fetching first meal:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

apiRouter.get("/past-meals", async (req, res) => {
  try {
    // MySQL's NOW() func could get the current date and time
    const meals = await knex.raw("SELECT * FROM Meal WHERE `when` < NOW()");
    res.json(meals[0]); // For MySQL, data is in the first element of the result
  } catch (error) {
    console.error("Error fetching past meals:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

apiRouter.get("/last-meal", async (req, res) => {
  try {
    const result = await knex.raw(
      "SELECT * FROM Meal ORDER BY id DESC LIMIT 1"
    );
    const meal = result[0][0];
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).send("No meals found :(");
    }
  } catch (error) {
    console.error("Error fetching last meal:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// This nested router example can also be replaced with your own sub-router
// apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
