const asyncHandler = require("express-async-handler")
const Hotel = require("../models/Hotel")
const bcrypt = require("bcryptjs")
const cloud = require("./../utils/cloudinary")
const { hotelPhotoUpload } = require("../utils/upload")
const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")
const sendEmail = require("../utils/email")
const { differenceInSeconds } = require("date-fns")
const { OAuth2Client } = require("google-auth-library")
const User = require("../models/User")

//      User Start
exports.continueWithGoogle = asyncHandler(async (req, res) => {
    const { credential } = req.body
    const client = new OAuth2Client({ clientId: process.env.GOOGLE_CLIENT_ID })
    const googleData = await client.verifyIdToken({ idToken: credential })
    const { email, name, picture } = googleData.payload

    const result = await User.findOne({ email })
    if (result) {
        const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)
        res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
        res.status(200).json({
            message: "user login success", result: {
                name: result.name,
                email: result.email,
                picture: result.picture
            }
        })
    } else {
        const userData = await User.create({ name, email, picture })
        const token = jwt.sign({ _id: userData._id }, process.env.JWT_KEY)
        res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })

        res.json({
            message: "user register success", result: {
                name: userData.name,
                email: userData.email,
                picture: userData.picture
            }

        })
    }

})

exports.userLogOut = asyncHandler(async (req, res) => {
    res.clearCookie("USER")
    res.json({ message: "user logout success" })
})
//    User end

//   Admin Start
exports.adminRegister = asyncHandler(async (req, res) => {
    await Admin.create(req.body)
    res.json({ message: "admin register success" })
})
exports.adminLogin = asyncHandler(async (req, res) => {
    const { username, otp } = req.body
    const result = await Admin.findOne({
        $or: [
            { email: username },
            { mobile: username }
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "invalid email / mobile" })
    }
    if (result.otp != otp) {
        return res.status(401).json({ message: "invalid otp" })
    }
    if (differenceInSeconds(new Date(), result.otpSendOn) > 60) {
        return res.status(401).json({ message: "otp expired" })
    }

    await Admin.findByIdAndUpdate(result._id, { otp: null })
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)
    res.cookie("ADMIN", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })

    res.json({
        message: "admin login success",
        result: {
            name: result.name,
            email: result.email,
            mobile: result.mobile
        },
    })
})
exports.sendOtp = asyncHandler(async (req, res) => {
    const { username } = req.body
    const result = await Admin.findOne({
        $or: [
            { email: username },
            { mobile: username }
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "invalid email / mobile" })
    }
    const otp = await Math.floor(100000 + Math.random() * 900000)
    await sendEmail({
        to: result.email,
        subject: "login Otp",
        message: `your login otp is ${otp}`
    })
    await Admin.findByIdAndUpdate(result._id, { otp, otpSendOn: new Date() })
    res.json({ message: "otp send success" })
})
exports.adminLogout = asyncHandler(async (req, res) => {
    res.clearCookie("ADMIN")
    res.json({ message: "admin logout success" })
})
//   Admin End 

//   Hotel Start
exports.hotelRegister = asyncHandler(async (req, res) => {
    hotelPhotoUpload(req, res, async (err) => {
        if (err) {
            res.status(400).json({
                message: "unable to upload",
                error: err.message
            })
        }
        const { password, email, mobile } = req.body
        const result = await Hotel.findOne({ email, mobile })
        if (result) {
            return res.status(401).json({ message: "email/mobile already registererd" })
        }
        const { secure_url } = await cloud.uploader.upload(req.file.path)
        const hash = await bcrypt.hash(password, 10)
        // console.log(password);

        await Hotel.create({ ...req.body, password: hash, photo: secure_url })
        res.json({ message: "hotel register success" })

    })
})
exports.hotelLogin = asyncHandler(async (req, res) => {
    const { username } = req.body
    const result = await Hotel.findOne({
        $or: [
            { email: username }, { mobile: username }
        ]
    })
    if (!result) {
        res.status(401).json({ message: "email / mobile not exist" })
    }
    const verify = await bcrypt.compare(req.body.password, result.password)
    if (!verify) {
        res.status(401).json({ message: "invalid password " })
    }
    const token = await jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)
    res.cookie("HOTEL", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false
    })
    res.json({
        message: "hotel login succcess",
        result: {
            name: result.name,
            photo: result.photo,
            isActive: result.isActive
        }
    })
})
exports.hotelLogout = asyncHandler(async (req, res) => {
    res.clearCookie("HOTEL")
    res.json({ message: "hotel logout success" })
})