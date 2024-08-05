import express from "express";
import knex from "../database_client.js";

const lastMeal = express.Router();

lastMeal.get("/", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM Meal ORDER BY id DESC LIMIT 1");
    // In MySQL, data is in the first element of the result
    res.json(meals[0]);
  } catch (error) {
    console.error("Error fetching all meals:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default lastMeal;
