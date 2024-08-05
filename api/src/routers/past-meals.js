import express from "express";
import knex from "../database_client.js";

const pastMeals = express.Router();

pastMeals.get("/", async (req, res) => {
  try {
    // MySQL's NOW() func could get the current date and time
    const meals = await knex.raw("SELECT * FROM Meal WHERE `when` < NOW()");
    res.json(meals[0]); // For MySQL, data is in the first element of the result
  } catch (error) {
    console.error("Error fetching future meals:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default pastMeals;
