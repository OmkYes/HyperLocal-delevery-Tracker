const { fetchFoodMenu, fetchHotels } = require("../controller/public.controller")

const route = require("express").Router()

route
    .get("/fetch-food-menu/:pid", fetchFoodMenu)
    .get("/fetch-hotels", fetchHotels)


module.exports = route