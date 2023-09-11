const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        var decodedToken = jwt.verify(token, "" + process.env.ACCESS_TOKEN_SECRET);
        req.role = decodedToken.role;
        req.userId = decodedToken.id
        next();

    } catch {
        res.status(401).send({ msg: 'You are not authorized' });
    }
};