const express = require("express");
const router = express.Router();
const searchDB = require("../database/search");

// GET /api/search/?term=something&limit=20&cuisine=chinese&city=&rating=5
router.get("/", async (req, res) => {
  try {
    const { term, limit } = req.query;
    const cuisine = req.query.cuisine;
    const rating = req.query.rating;
    const data = await searchDB.get(term, limit, cuisine, rating);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.get("/filters/cuisines", async (req, res) => {
  try {
    const data = await searchDB.getCuisine();
    const filter = {
      query: "cuisine",
      values: data.map((item) => item.cuisine),
    };
    return res.send(filter);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.get("/filterCuisine", async (req, res) => {
  try {
    const data = await searchDB.filterCuisine(req.query.cuisine);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.get("/filters/extra-services/", async (req, res) => {
  try {
    const data = await searchDB.getExtraServices();
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

module.exports = router;
