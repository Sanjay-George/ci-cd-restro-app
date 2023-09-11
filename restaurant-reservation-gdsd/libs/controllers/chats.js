const express = require("express");
const auth = require("../utils/auth");
const { validateInt } = require("../utils/inputValidator");
const router = express.Router();
const chatDB = require("../database/chat");
const restaurantDB = require("../database/restaurants");


// GET /api/chats/connected-users/  - Get list of rest owners connected with
router.get('/connected-users/', auth, async (req, res) => {
    try {
        const { userId, role } = req;
        // TODO: check role and call appropriate DB method
        const data = await chatDB.getListOfConnectedRestaurants(userId);
        return res.send(data);
    }
    catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});

// GET /api/chats/v2/connected-users  - Duplicate created temporarily for restaurant owner chats. 
// TODO remove when role is set properly
router.get('/v2/connected-users/', auth, async (req, res) => {
    try {
        const { userId, role } = req;
        // TODO: check role and call appropriate DB method
        const data = await chatDB.getListOfConnectedUsers(userId);
        return res.send(data);
    }
    catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});


// GET /api/chats/{id}  - Get all chats by chatId
router.get('/:id', async (req, res) => {
    try {
        const { id: chatId } = req.params;
        const data = await chatDB.getMessages(chatId);
        return res.send(data);
    }
    catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});

// GET /api/chats/chat-id/{restaurantId}
router.get('/chat-id/:restaurantId', auth, async (req, res) => {
    try {
        if (!req.role || req.role !== "user" || !req.userId) {
            return res.status(401).send({
                msg: "You are not authorized! Only registered users can chat",
            });
        }

        const { restaurantId } = req.params;
        let data = await chatDB.getChatIdByRestaurantAndUser(req.userId, restaurantId);

        if (data && data.length) {
            return res.send(data);
        }

        const restaurantDetails = (await restaurantDB.getRestaurantDetails(restaurantId))[0];
        await chatDB.createNewChat(req.userId, restaurantDetails.userId);
        data = await chatDB.getChatIdByRestaurantAndUser(req.userId, restaurantId);

        return res.send(data);
    }
    catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});


module.exports = router;