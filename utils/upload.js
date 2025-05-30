const multer = require("multer")

const hotelPhotoUpload = multer({ storage: multer.diskStorage({}) }).single("photo")
const itemUpload = multer({ storage: multer.diskStorage({}) }).array("images", 2)

module.exports = { hotelPhotoUpload, itemUpload }