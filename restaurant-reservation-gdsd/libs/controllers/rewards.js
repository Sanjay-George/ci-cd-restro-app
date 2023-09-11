const express = require("express");
const router = express.Router();
const rewardsDB = require("../database/rewards");

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const data = await rewardsDB.getRewards(userId);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

module.exports = router;
