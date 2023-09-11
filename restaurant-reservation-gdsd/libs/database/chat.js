const { validateInt, isStringUndefinedOrEmpty } = require("../utils/inputValidator");
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
            if (error)  reject(error);
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
            if (error)  reject(error);
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
        pool.query(query, [restaurantId, userId], function (error, results, fields) {
            if (error)  reject(error);
            resolve(results);
        });
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
    })
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
            if (error)  reject(error);
            resolve(results);
        });
    });
};



const addMessage = ({chatId, senderId, destinationId, message, timestamp}) => {
    if(!validateInt(chatId) || !validateInt(senderId) || isStringUndefinedOrEmpty(message)) {
        return;
    }

    const sql = `INSERT INTO messages (chatId, senderId, message) VALUES (?, ?, ?)`;
        
    return new Promise((resolve, reject) => {
        pool.query(sql, [chatId, senderId, message], (error, result, fields) => {
            if (error) reject(error);
            resolve(result?.insertId);
        });
    })
}



module.exports ={
    getListOfConnectedRestaurants,
    getListOfConnectedUsers,
    getChatIdByRestaurantAndUser,
    getMessages,
    addMessage,
    createNewChat,
}