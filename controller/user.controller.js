const asyncHandler = require("express-async-handler")
const Orders = require("../models/Orders")
const User = require("../models/User")
const sendEmail = require("../utils/email")
const { differenceInSeconds } = require("date-fns/differenceInSeconds")

exports.placeOrder = asyncHandler(async (req, res) => {
    await Orders.create({ ...req.body, user: req.user })
    const result = await User.findById(req.user)


    await sendEmail({
        to: result.email,
        subject: "order placed",
        message: `your order is placed successfully of id ${result._id}`
    })
    res.json({ message: "Order Place success" })
})
exports.cancleOrder = asyncHandler(async (req, res) => {
    // console.log(req.params.cid)
    const result = await Orders.findById(req.params.cid)
    console.log(differenceInSeconds(new Date(), result.createdAt))

    if (differenceInSeconds(new Date(), result.createdAt) > 60) {
        return res.status(401).json({ message: "order cannot be cancle" })
    }
    await Orders.findByIdAndUpdate(req.params.cid, { status: "cancle" })

    res.json({ message: "Order cancleeed success" })
})
exports.userOrderHistory = asyncHandler(async (req, res) => {
    const result = await Orders.find({ user: req.user }).populate("products.product")
    res.json({ message: "Order history fetch success", result })
})