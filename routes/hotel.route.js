const { readMenu, addMenu, updateMenu, deleteMenu, totalSales } = require("../controller/hotel.controller")

const route = require("express").Router()

route
    .get("/read-menu", readMenu)
    .post("/add-menu", addMenu)
    .patch("/update-menu/:iid", updateMenu)
    .delete("/delte-menu/:iid", deleteMenu)
    .get("/total-sales", totalSales)

module.exports = route