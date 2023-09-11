
const jwt = require('jsonwebtoken');

const connectedUsers = {};
const socketUserMapping = {};

handleSocketAuthorization = (socket, next) =>  {
    const token = socket.handshake.auth.token;
    const socketId = socket.id;

    if(!token) {
        console.error(`SOCKET - Connection with id ${socketId} does not have a valid web token. Not allowed to connect!`);
        return;
    }

    const decodedToken = jwt.verify(token, "" + process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.id;

    if(!userId) {
        console.error("SOCKET - Undefined or invalid user Id")
        return;
    }
 
    console.log(`a user connected. socketId: ${socketId}, userId: ${userId}`);

    socketUserMapping[socketId] = userId;
    if(!connectedUsers[userId]) {
        connectedUsers[userId] = [socketId];
    }
    else {
        connectedUsers[userId].push(socketId);
    }

    next();
}

const getSocketId = (userId) => {
    return connectedUsers[userId];
}

const removeSocketMapping = (socketId) => {
    const userId = socketUserMapping[socketId];
    connectedUsers[userId] = connectedUsers[userId].filter(item => item !== socketId);
}

module.exports = {
    handleSocketAuthorization,
    getSocketId,
    removeSocketMapping,
}