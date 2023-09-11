const passOnRestaurantId = (req, res, next ) => {
    req.restaurantId = req.params.id;
    next();
};


module.exports = {
    passOnRestaurantId,
}

