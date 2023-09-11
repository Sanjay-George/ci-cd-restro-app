const express = require("express");
const router = express.Router();
const dummyDL = require("../database/dummy");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    console.log(limit);
    const data = await dummyDL.getMultiple(limit);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

module.exports = router;
