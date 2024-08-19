import express from "express";
import knex from "../database_client.js";

const reviews = express.Router();

//  ----------- /api/reviews | GET | Returns all reviews -----------
reviews.get("/", async (req, res) => {
  try {
    const reviews = await knex("Review").select("*");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//  ----------- /api/reviews | GET | Returns all reviews -----------

export default reviews;
