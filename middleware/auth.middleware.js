const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const Hotel = require("../models/Hotel")

exports.hotelProtected = asyncHandler(async (req, res, next) => {

    const token = req.cookies.HOTEL
    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, async (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "inavlid token", error: err.message })
        }
        const result = await Hotel.findById(data._id)
        if (!result.isActive) {
            return res.status(401).json({ message: "account blocked by admin" })
        }
        req.user = data._id
        next()
    })
})
exports.adminProtected = asyncHandler(async (req, res, next) => {

    const token = req.cookies.ADMIN
    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "inavlid token", error: err.message })
        }
        req.user = data._id
        next()
    })
})
exports.userProtected = asyncHandler(async (req, res, next) => {

    const token = req.cookies.USER
    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "inavlid token", error: err.message })
        }
        req.user = data._id
        next()
    })
})