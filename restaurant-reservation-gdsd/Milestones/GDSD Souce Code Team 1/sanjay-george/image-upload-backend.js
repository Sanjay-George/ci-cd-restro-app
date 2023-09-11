/*
 ** File: server.js
 */
app.use("/api/restaurants/:id/images", passOnRestaurantId, imagesRouter);

/*
 ** File: ./libs/controllers/images.js
 */

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
    res.send(data);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});

router.get("/menu", async (req, res) => {
  try {
    const { restaurantId } = req;
    const { count, offset } = req.query;
    const data = await imagesDB.getMenuImages(restaurantId, count, offset);
    res.send(data);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
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

      res.send({
        msg: "Image uploaded",
        imageId: imageId,
        url: `${IMAGE_PATH}/${fileName}`,
      });
    }
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
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
    res.sendStatus(500);
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
    res.sendStatus(500);
  }
});

module.exports = router;

/*
 ** File: ./libs/utils/imageStore.js
 */

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const IMAGE_FOLDER = path.resolve(__dirname, "../../uploads/");
const IMAGE_PATH = "/uploads/images";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, IMAGE_FOLDER);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + Date.now() + ext;
    req.fileName = fileName;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Only accept images
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

module.exports = {
  upload,
  IMAGE_FOLDER,
  IMAGE_PATH,
};

/*
 ** File: ./libs/database/images.js
 */

const { pool } = require("./config");

/* File author: Sanjay George */

const getImages = (
  restaurantId,
  status = "approved",
  count = 20,
  offset = 0
) => {
  const statusCheck = status !== "all" ? `and i.status = "${status}"` : "";

  const query = `
      select i.*, r.name as restaurantName from images i
      inner join restaurants r on i.restaurantid = r.id 
      where i.restaurantid = ${restaurantId}
      ${statusCheck}
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

const getMenuImages = (restaurantId, count = 20, offset = 0) => {
  const query = `
      select i.*, r.name as restaurantName from images i
      inner join restaurants r on i.restaurantid = r.id 
      where i.restaurantid = ?
      and i.status = "approved"
      and i.ismenuimage = true
      limit ?
      offset ?;
      `;

  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [restaurantId, count, offset],
      function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const getImage = (imageId) => {
  const query = `
      select * from images 
      where id = ?
      `;

  return new Promise((resolve, reject) => {
    pool.query(query, [imageId], function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const deleteImage = (imageId) => {
  const sql = `
        delete from images where id = ?;
    `;

  return new Promise((resolve, reject) => {
    pool.query(sql, [imageId], (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const addImage = (restaurantId, path, isMenuImage) => {
  const sql = `insert into images (restaurantid, status, path, ismenuimage)
    values (?, "uploaded", ?, ${isMenuImage});`;

  return new Promise((resolve, reject) => {
    pool.query(sql, [restaurantId, path], (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const updateImageStatus = (imageId, status) => {
  if (!status) return;

  const sql = `
      update images 
      set status = ?
      where id = ?`;

  return new Promise((resolve, reject) => {
    pool.query(sql, [status, imageId], (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

module.exports = {
  getImages,
  getMenuImages,
  getImage,
  deleteImage,
  addImage,
  updateImageStatus,
};
