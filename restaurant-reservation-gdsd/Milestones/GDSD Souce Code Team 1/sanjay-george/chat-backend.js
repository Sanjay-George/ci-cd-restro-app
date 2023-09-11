/*
 ** File: ./server.js
 */
const { Server } = require("socket.io");

const io = new Server(5001, {
  cors: {
    origin: true,
  },
});

io.use(handleSocketAuthorization);
io.on("connection", (socket) => {
  socket.on("chat-c2s", async (msg) => {
    try {
      await chatDB.addMessage(msg);
      const recpientSocketId = getSocketId(msg.destinationId);
      console.log({
        ...msg,
        senderSocketId: socket.id,
        recpientSocketId: recpientSocketId,
      });
      io.to(recpientSocketId).emit("chat-s2c", msg);
    } catch (ex) {
      console.error(ex);
    }
  });

  socket.on("disconnect", () => {
    removeSocketMapping(socket.id);
    console.log(`\nuser disconnected, socketId: ${socket.id}`);
  });
});

/*
 ** File: ./libs/utils/socket.js
 */
const jwt = require("jsonwebtoken");
const connectedUsers = {};
const socketUserMapping = {};

handleSocketAuthorization = (socket, next) => {
  const token = socket.handshake.auth.token;
  const socketId = socket.id;

  if (!token) {
    console.error(
      `SOCKET - Connection with id ${socketId} does not have a valid web token. Not allowed to connect!`
    );
    return;
  }

  const decodedToken = jwt.verify(token, "" + process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.id;

  if (!userId) {
    console.error("SOCKET - Undefined or invalid user Id");
    return;
  }

  console.log(`a user connected. socketId: ${socketId}, userId: ${userId}`);

  socketUserMapping[socketId] = userId;
  if (!connectedUsers[userId]) {
    connectedUsers[userId] = [socketId];
  } else {
    connectedUsers[userId].push(socketId);
  }

  next();
};

const getSocketId = (userId) => {
  return connectedUsers[userId];
};

const removeSocketMapping = (socketId) => {
  const userId = socketUserMapping[socketId];
  connectedUsers[userId] = connectedUsers[userId].filter(
    (item) => item !== socketId
  );
};

/*
 ** File: ./libs/controllers/chats.js
 */
const express = require("express");
const auth = require("../utils/auth");
const { validateInt } = require("../utils/inputValidator");
const router = express.Router();
const chatDB = require("../database/chat");
const restaurantDB = require("../database/restaurants");

// GET /api/chats/connected-users/  - Get list of rest owners connected with
router.get("/connected-users/", auth, async (req, res) => {
  try {
    const { userId, role } = req;
    // TODO: check role and call appropriate DB method
    const data = await chatDB.getListOfConnectedRestaurants(userId);
    res.send(data);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});

// GET /api/chats/v2/connected-users  - Duplicate created temporarily for restaurant owner chats.
// TODO remove when role is set properly
router.get("/v2/connected-users/", auth, async (req, res) => {
  try {
    const { userId, role } = req;
    // TODO: check role and call appropriate DB method
    const data = await chatDB.getListOfConnectedUsers(userId);
    res.send(data);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});

// GET /api/chats/{id}  - Get all chats by chatId
router.get("/:id", async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const data = await chatDB.getMessages(chatId);
    res.send(data);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});

// GET /api/chats/chat-id/{restaurantId}
router.get("/chat-id/:restaurantId", auth, async (req, res) => {
  try {
    if (!req.role || req.role !== "user" || !req.userId) {
      return res.status(401).send({
        msg: "You are not authorized! Only registered users can chat",
      });
    }

    const { restaurantId } = req.params;
    let data = await chatDB.getChatIdByRestaurantAndUser(
      req.userId,
      restaurantId
    );

    if (data && data.length) {
      return res.send(data);
    }

    const restaurantDetails = (
      await restaurantDB.getRestaurantDetails(restaurantId)
    )[0];
    await chatDB.createNewChat(req.userId, restaurantDetails.userId);
    data = await chatDB.getChatIdByRestaurantAndUser(req.userId, restaurantId);

    res.send(data);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});
module.exports = router;

/*
 ** File: ./libs/database/chat.js
 */
const {
  validateInt,
  isStringUndefinedOrEmpty,
} = require("../utils/inputValidator");
const { pool } = require("./config");

const getListOfConnectedRestaurants = (userId) => {
  const query = `select
        c.id as chatId,
        c.user as userId,
        c.restaurantOwner as restaurantOwnerId,
        u.firstName,
        u.lastName
        from chats c 
        inner join users u 
        on u.id = c.restaurantOwner 
        where c.user = ${userId}
        `;

  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const getListOfConnectedUsers = (ownerId) => {
  const query = `
    select
        c.id as chatId,
        c.user as userId,
        c.restaurantOwner as restaurantOwnerId,
        u.firstName,
        u.lastName,
        count(m.id) as messageCount
        from chats c 
        inner join messages m on m.chatid = c.id
        inner join users u on u.id = c.user 
        where c.restaurantOwner = ?
        group by userId
        order by chatId;
        `;

  return new Promise((resolve, reject) => {
    pool.query(query, [ownerId], function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const getChatIdByRestaurantAndUser = (userId, restaurantId) => {
  const query = `
        select 
        c.id as chatId, 
        c.user as userId, 
        c.restaurantowner as restaurantOwnerId,
        r.id as restaurantId,
        u.lastName as recipientLastName,
        u.firstName as recipientFirstName
        from chats c 
        inner join restaurants r on r.userid = c.restaurantowner
        inner join users u on u.id = c.restaurantowner
        where r.id = ?
        and c.user = ?;
    `;

  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [restaurantId, userId],
      function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const createNewChat = (userId, restaurantOwnerId) => {
  const sql = `
        INSERT INTO chats 
        (user, restaurantowner) 
        VALUES (?, ?)`;

  return new Promise((resolve, reject) => {
    pool.query(sql, [userId, restaurantOwnerId], (error, result, fields) => {
      if (error) reject(error);
      resolve(result.insertId);
    });
  });
};

const getMessages = (chatId) => {
  const query = `SELECT 
        chatid, senderId, message 
        FROM messages 
        where chatid = ?
        order by id;
        `;

  return new Promise((resolve, reject) => {
    pool.query(query, [chatId], function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const addMessage = ({
  chatId,
  senderId,
  destinationId,
  message,
  timestamp,
}) => {
  if (
    !validateInt(chatId) ||
    !validateInt(senderId) ||
    isStringUndefinedOrEmpty(message)
  ) {
    return;
  }

  const sql = `INSERT INTO messages (chatId, senderId, message) VALUES (?, ?, ?)`;

  return new Promise((resolve, reject) => {
    pool.query(sql, [chatId, senderId, message], (error, result, fields) => {
      if (error) reject(error);
      resolve(result?.insertId);
    });
  });
};
module.exports = {
  getListOfConnectedRestaurants,
  getListOfConnectedUsers,
  getChatIdByRestaurantAndUser,
  getMessages,
  addMessage,
  createNewChat,
};
