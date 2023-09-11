/* File Author: Sanjay George */

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const imagesDB = require("../database/images");
const auth = require("../utils/auth");
const { IMAGE_FOLDER, IMAGE_PATH, upload } = require("../utils/imageStore");

/*
    GET /restaurants/:id/images             - get all images
    GET /restaurants/:id/images/menu        - get menu images
    POST /restaurants/:id/images            - upload image
    DELETE /restaurants/:id/images/:id      - delete image by id
    PUT /restaurants/:id/images/:id/status  - moderate image status
*/

router.get("/", async (req, res) => {
  try {
    const { restaurantId } = req;
    const { status, count, offset } = req.query;
    const data = (
      await imagesDB.getImages(restaurantId, status, count, offset)
    ).map((item) => {
      return {
        ...item,
        isMenuImage: item.isMenuImage == 1,
      };
    });
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.get("/menu", async (req, res) => {
  try {
    const { restaurantId } = req;
    const { count, offset } = req.query;
    const data = await imagesDB.getMenuImages(restaurantId, count, offset);
    return res.send(data);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.post("/", [auth, upload.single("image")], async (req, res) => {
  try {
    if (!req.role || req.role !== "restaurantOwner" || !req.userId) {
      return res.status(401).send({
        msg: "You are not authorized! Only restaurant owners can add images",
      });
    }

    const { restaurantId, fileName } = req;
    const { isMenuImage } = req.body;

    const result = await imagesDB.addImage(restaurantId, fileName, isMenuImage);

    if (result?.affectedRows > 0) {
      const imageId = result.insertId;

      return res.send({
        msg: "Image uploaded",
        imageId: imageId,
        url: `${IMAGE_PATH}/${fileName}`,
      });
    }
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.role || req.role !== "restaurantOwner" || !req.userId) {
      return res.status(401).send({
        msg: "You are not authorized! Only restaurant owners can delete images",
      });
    }
    const { id: imageId } = req.params;

    const data = await imagesDB.getImage(imageId);
    if (!data || !data.length) {
      return res.sendStatus(404);
    }

    const imageDetails = data[0];
    const imagePath = path.join(IMAGE_FOLDER, imageDetails.path);

    fs.unlink(imagePath, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error deleting image!");
      } else {
        await imagesDB.deleteImage(imageId);
        return res.send({
          msg: "Image deleted",
        });
      }
    });
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.put("/:id/status", auth, async (req, res) => {
  try {
    if (!req.role || req.role !== "admin" || !req.userId) {
      return res.status(401).send({
        msg: "You are not authorized! Only admins can moderate images",
      });
    }

    const { id: imageId } = req.params;
    const { status } = req.body;

    await imagesDB.updateImageStatus(imageId, status);

    return res.send({
      msg: "Image moderation updated",
    });
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

module.exports = router;
