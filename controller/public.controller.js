const asyncHandler = require("express-async-handler")
const Items = require("../models/Items")
const Hotel = require("../models/Hotel")

exports.fetchFoodMenu = asyncHandler(async (req, res) => {
    const { pid } = req.params
    console.log(pid)

    const result = await Items.find({ hotel: pid })
    res.json({ message: "mneu fecth success", result })
})

exports.fetchHotels = asyncHandler(async (req, res) => {
    const result = await Hotel.find({ isActive: true })
    res.json({ message: "hotels fecth success", result })

})
