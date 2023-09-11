const express = require("express");
const router = express.Router();
const reviewsDB = require("../database/reviews");

// GET /restaurants/:id/reviews/?count=10&offset=10
router.get("/", async (req, res) => {
  try {
    const { restaurantId } = req;
    const { count, offset } = req.query;
    const data = await reviewsDB.getReviews(restaurantId, count, offset);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

module.exports = router;

// ../database/reviews
const getReviews = (restaurantId, count = 10, offset = 0) => {
  const query = `
    SELECT re.*, u.lastName, u.firstName, u.email, u.phoneNumber
    FROM reviews re
    inner join users u on re.userid = u.id
    inner join restaurants r on re.restaurantid = r.id
    inner join roles ro on u.roleid = ro.id
    where ro.id = 1
    and r.id = ${restaurantId}
    limit ${count}
    offset ${offset};
    `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};
