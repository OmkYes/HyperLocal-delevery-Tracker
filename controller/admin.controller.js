const asyncHandler = require("express-async-handler")
const Hotel = require("../models/Hotel")
const Items = require("../models/Items")
const User = require("../models/User")
const Orders = require("../models/Orders")
const sendEmail = require("../utils/email")

exports.getAllHotels = asyncHandler(async (req, res) => {
    try {
        const result = await Hotel.find()
        res.json({ message: "all hotel fetch success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to fetch", error: error.message })
    }
})
exports.getAllItems = asyncHandler(async (req, res) => {
    try {
        const result = await Items.find().populate("hotel")
        res.json({ message: "all hotel fetch success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to fetch", error: error.message })
    }
})
exports.getAllUsers = asyncHandler(async (req, res) => {
    try {
        const result = await User.find()
        res.json({ message: "all users fetch success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to fetch", error: error.message })
    }
})
exports.getAllOrders = asyncHandler(async (req, res) => {
    try {
        const result = await Orders.find().populate("user").populate("products.product")
        res.json({ message: "all orders fetch success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to fetch", error: error.message })
    }
})
exports.updateHotel = asyncHandler(async (req, res) => {
    await Hotel.findByIdAndUpdate(req.params.pid, { isActive: req.body.isActive })
    res.json({ message: "items update success" })

})
exports.updateItems = asyncHandler(async (req, res) => {
    await Items.findByIdAndUpdate(req.params.iid, { isPublish: req.body.isPublish })
    res.json({ message: "hotel update success" })

})
exports.updateUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.params.uid, { isActive: req.body.isActive })
    res.json({ message: "user update success" })

})
exports.updateOrder = asyncHandler(async (req, res) => {
    const orderData = await Orders.findByIdAndUpdate(req.params.oid, { status: req.body.status })
    // console.log(orderData.user)
    const result = await User.findById(orderData.user)

    if (req.body.status === "deliver") {
        await sendEmail({
            to: result.email,
            subject: "order status update",
            messsage: `Your order ${result.id} is deleverd success`
        })
    }
    res.json({ message: "Order update success", result })

})