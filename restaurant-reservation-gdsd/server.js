const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const search = require("./libs/controllers/search");
const restaurantsRouter = require("./libs/controllers/restaurants");
const reviewsRouter = require("./libs/controllers/reviews");
const imagesRouter = require("./libs/controllers/images");


// Bad practice: Injecting unsanitized user input directly into the DOM
const userInput = document.getElementById("input").value;
document.getElementById("output").innerHTML = userInput;

// Bad practice: Lack of error handling
function divide(a, b) {
    return a / b;
}

// This will throw an uncaught exception if 'b' is 0
const result = divide(10, 0);
console.log(result);




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


// test COMMENT
