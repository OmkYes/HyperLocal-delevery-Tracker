const { continueWithGoogle, userLogOut, adminRegister, adminLogin, adminLogout, sendOtp, hotelRegister, hotelLogin, hotelLogout } = require("../controller/auth.controller")

const route = require("express").Router()

route
    .post("/google-login", continueWithGoogle)
    .post("/user-logout", userLogOut)
    .post("/admin-register", adminRegister)
    .post("/admin-login", adminLogin)
    .post("/send-otp", sendOtp)
    .post("/admin-logout", adminLogout)
    .post("/hotel-register", hotelRegister)
    .post("/hotel-login", hotelLogin)
    .post("/hotel-logout", hotelLogout)


module.exports = route