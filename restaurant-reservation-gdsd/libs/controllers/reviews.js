const express = require("express");
const router = express.Router();
const reviewsDB = require("../database/reviews");
const reservationDB = require("../database/booking");
const auth = require("../utils/auth");

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

// GET /restaurants/:id/reviews/:id/
router.get("/:id", async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const data = await reviewsDB.getReview(reviewId);
    if (!data || !data.length) {
      return res.sendStatus(404);
    }
    return res.send(data[0]);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

// POST /restaurants/:id/reviews
router.post("/", auth, async (req, res) => {
  try {
    if (!req.role || req.role !== "user" || !req.userId) {
      return res.status(401).send({
        msg: "You are not authorized! Only registered users can add reviews",
      });
    }

    const { restaurantId } = req;
    const { rating, description } = req.body;

    const existingReviewsByUser = await reviewsDB.getReviewByUserAndRestaurant(
      req.userId,
      restaurantId
    );
    if (existingReviewsByUser.length > 0) {
      return res.status(403).send({
        msg: "You already have posted a reivew for the restaurant! Please modify your existing review",
      });
    }

    const reservationByUser = await reservationDB.getReservationByUser(
      req.userId,
      restaurantId
    );
    if (!reservationByUser.length) {
      return res.status(403).send({
        msg: "You don't have an active reservation for this restaurant!",
      });
    }

    const result = await reviewsDB.addReview(
      req.userId,
      restaurantId,
      rating,
      description
    );

    if (result?.affectedRows > 0) {
      const reviewId = result.insertId;
      return res.send({
        msg: "Review inserted",
        reviewId: reviewId,
        url: `/restaurants/${restaurantId}/reviews/${reviewId}/`,
      });
    }
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

// PUT /restaurants/:id/reviews/:id
router.put("/:id", auth, async (req, res) => {
  try {
    if (!req.role || req.role !== "user" || !req.userId) {
      return res.status(401).send({
        msg: "You are not authorized! Only registered users can add reviews",
      });
    }

    const { restaurantId } = req;
    const { id: reviewId } = req.params;
    const { rating, description } = req.body;

    const result = await reviewsDB.updateReview(reviewId, rating, description);

    if (result?.affectedRows > 0) {
      return res.send({
        msg: "Review updated",
        reviewId: reviewId,
        url: `/restaurants/${restaurantId}/reviews/${reviewId}/`,
      });
    }
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

// DELETE /restaurants/:id/reviews/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.role || req.role !== "user" || !req.userId) {
      return res.status(401).send({
        msg: "You are not authorized! Only registered users can add reviews",
      });
    }
    const { id: reviewId } = req.params;
    const result = await reviewsDB.deleteReview(reviewId, req.userId);
    return res.send({
      msg: "Review deleted",
    });
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

module.exports = router;
