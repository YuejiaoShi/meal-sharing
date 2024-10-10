import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import DBConnection from "./database_client.js";
import meals from "./routers/meals.js";
import reservations from "./routers/reservations.js";
import reviews from "./routers/reviews.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
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
    const meals = await DBConnection("Meal").orderBy("id", "asc");
    res.json(meals);
  } catch (error) {
    console.error("Error fetching all meals:", error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/future-meals", async (req, res) => {
  try {
    // MySQL's NOW() func could get the current date and time
    const futureMeals = await DBConnection("Meal").where(
      "when",
      ">",
      DBConnection.raw("NOW()")
    );
    res.json(futureMeals);
  } catch (error) {
    console.error("Error fetching future meals:", error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/first-meals", async (req, res) => {
  try {
    const firstMeal = await DBConnection("Meal").orderBy("id", "asc").limit(1);

    if (firstMeal.length == 0) {
      res.status(404).send("No meals found :(");
    } else {
      res.json(firstMeal);
    }
  } catch (error) {
    console.error("Error fetching first meal:", error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/past-meals", async (req, res) => {
  try {
    // MySQL's NOW() func could get the current date and time
    const pastMeals = await DBConnection("Meal").where("when", "<", DBConnection.raw("NOW()"));
    res.json(pastMeals);
  } catch (error) {
    console.error("Error fetching past meals:", error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/last-meal", async (req, res) => {
  try {
    const lastMeal = await DBConnection("Meal").orderBy("ID", "desc").limit(1);
    if (lastMeal.length == 0) {
      res.status(404).send("No meals found :(");
    } else {
      res.json(lastMeal);
    }
  } catch (error) {
    console.error("Error fetching last meal:", error);
    res.status(500).json({ error: error.message });
  }
});

// ******** Sub-Routers ********
apiRouter.use("/meals", meals);
apiRouter.use("/reservations", reservations);
apiRouter.use("/reviews", reviews);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
