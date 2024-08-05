import express from "express";
import knex from "../database_client.js";

const firstMeal = express.Router();

firstMeal.get("/", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id ASC LIMIT 1");
    const meal = result[0][0];
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ message: "No meals found" });
    }
  } catch (error) {
    console.error("Error fetching all meals:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default firstMeal;
