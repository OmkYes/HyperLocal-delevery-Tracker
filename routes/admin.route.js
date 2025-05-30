const { getAllHotels, getAllItems, updateHotel, updateItems, getAllUsers, getAllOrders, updateUser, updateOrder } = require("../controller/admin.controller")

const route = require("express").Router()

route
    .get("/get-all-hotels", getAllHotels)
    .get("/get-all-items", getAllItems)
    .get("/get-all-users", getAllUsers)
    .get("/get-all-orders", getAllOrders)
    .patch("/update-items/:iid", updateItems)
    .patch("/update-hotel/:pid", updateHotel)
    .patch("/update-user/:uid", updateUser)
    .patch("/update-order/:oid", updateOrder)


module.exports = route
