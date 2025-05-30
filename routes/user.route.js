const userC = require("../controller/user.controller")

const route = require("express").Router()

route
    .post("/order-placed", userC.placeOrder)
    .patch("/order-cancle/:cid", userC.cancleOrder)
    .get("/order-fetched", userC.userOrderHistory)


module.exports = route