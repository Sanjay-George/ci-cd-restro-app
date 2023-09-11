const express = require("express");
const router = express.Router();
const userDB = require("../database/users");
const jwt = require("jsonwebtoken");
const auth = require("../utils/auth");
const bcrypt = require("bcryptjs");
const { hochshuleEmailValidation } = require("../utils/inputValidator");

// Roles:
// admin => 1
// user => 2
// restaurantOwner => 3

router.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phonenumber = req.body.phonenumber;
    const hashedPassword = await bcrypt.hash(password, 8);

    if (hochshuleEmailValidation(email)) {
      const data = await userDB.putUser(
        email,
        hashedPassword,
        firstName,
        lastName,
        phonenumber
      );
      if (data) {
        delete req.body.password;
        return res.send({ msg: "Registration Successful", data: req.body });
      } else {
        return res.send({ msg: "Can not register at the moment" });
      }
    } else {
      res.status(400).send({
        msg: "You only can register using Hochschule Fulda email address",
      });
    }
  } catch (ex) {
    if (ex) {
      return res.send({ msg: ex });
    }
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const data = await userDB.login(email);
    if (data.length > 0) {
      const validPass = await bcrypt.compare(password, data[0].password);
      if (validPass) {
        const accessToken = jwt.sign(
          data[0],
          "" + process.env.ACCESS_TOKEN_SECRET
        );
        delete data[0].password;
        return res.send({
          msg: "Login successful",
          data: data[0],
          accessToken: accessToken,
        });
      } else {
        res.status(500).send({ msg: "Wrong password" });
      }
    } else {
      res.status(500).send({ msg: "email or password is in incorrect" });
    }
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.post("/assign-role", auth, async (req, res) => {
  try {
    if (req.role === "admin") {
      const roleId = req.body.roleId;
      const email = req.body.email;
      const data = await userDB.assignRole(email, roleId);
      if (data) {
        return res.send({ msg: "User role updated successfully" });
      } else {
        return res.send({ msg: "Can not update users role" });
      }
    } else {
      res.status(401).send({ msg: "You are not authorized" });
    }
  } catch (ex) {
    if (ex) {
      return res.send({ msg: ex });
    }
    console.error(ex);
    return res.sendStatus(500);
  }
});

router.get("/my-profile", auth, async (req, res) => {
  try {
    const { userId } = req;
    const data = await userDB.getMyProfile(userId);
    let userData = data[0];
    delete userData?.password;
    return res.send(userData);
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

module.exports = router;
