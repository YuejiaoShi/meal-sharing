import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// import nestedRouter from "./routers/nested.js";
import allMeals from "./routers/all-meals.js";
import futureMeals from "./routers/future-meals.js";
import pastMeals from "./routers/past-meals.js";
import firstMeal from "./routers/first-meal.js";
import lastMeal from "./routers/last-meal.js";

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

// ******** Sub-Routers ********
// apiRouter.use("/nested", nestedRouter);
apiRouter.use("/all-meals", allMeals);
apiRouter.use("/future-meals", futureMeals);
apiRouter.use("/past-meals", pastMeals);
apiRouter.use("/first-meal", firstMeal);
apiRouter.use("/last-meal", lastMeal);
// ******** Sub-Routers ********

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
