const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const search = require("./libs/controllers/search");
const restaurantsRouter = require("./libs/controllers/restaurants");
const reviewsRouter = require("./libs/controllers/reviews");
const imagesRouter = require("./libs/controllers/images");
const users = require("./libs/controllers/users");
const chats = require("./libs/controllers/chats");
const chatDB = require("./libs/database/chat");

const booking = require("./libs/controllers/booking");
const { passOnRestaurantId } = require("./libs/utils/middlewares");
const { IMAGE_PATH } = require("./libs/utils/imageStore");
const {
  handleSocketAuthorization,
  getSocketId,
  removeSocketMapping,
} = require("./libs/utils/socket");
const rewards = require("./libs/controllers/rewards");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

const io = new Server(5001, {
  cors: {
    origin: true,
  },
});

app.use(express.json());
app.use(cors());
app.use(IMAGE_PATH, express.static("uploads"));

// SECTION: load routers
app.use("/api/search", search);
app.use("/api/restaurants/:id/reviews", passOnRestaurantId, reviewsRouter);
app.use("/api/restaurants/:id/images", passOnRestaurantId, imagesRouter);
app.use("/api/restaurants", restaurantsRouter);
app.use("/api/users", users);
app.use("/api/booking", booking);

app.use("/api/chats", chats);
app.use("/api/rewards", rewards);

io.use(handleSocketAuthorization);

io.on("connection", (socket) => {

  // LISTEN FOR MESSAGES FROM CLIENT
  socket.on("chat-c2s", async (msg) => {
    try {
      await chatDB.addMessage(msg);
      const recpientSocketId = getSocketId(msg.destinationId);
      console.log({ ...msg, senderSocketId: socket.id, recpientSocketId: recpientSocketId });
      io.to(recpientSocketId).emit("chat-s2c", msg);
    }
    catch (ex) {
      console.error(ex);
    }
  });

  socket.on("disconnect", () => {
    removeSocketMapping(socket.id);
    console.log(`\nuser disconnected, socketId: ${socket.id}`);
  });
});

// TODO: Socket on disconnect, remove the mapping

app.listen(PORT, () => {
  console.log(`Node server listening on port: ${PORT}`);
});
