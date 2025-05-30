const asyncHandler = require("express-async-handler")
const cloud = require("./../utils/cloudinary")
const { itemUpload } = require("./../utils/upload")
const Items = require("../models/Items")
const path = require("path")
const Hotel = require("../models/Hotel")
const Orders = require("../models/Orders")

exports.addMenu = asyncHandler(async (req, res) => {
    itemUpload(req, res, async err => {

        if (err) {
            console.log(err)
            return res.status(400).json({ message: "multer eroor", err: err.message })
        }
        const { name, desc, price, type } = req.body
        const img = []
        for (const item of req.files) {
            const { secure_url } = await cloud.uploader.upload(item.path)
            img.push(secure_url)
        }
        await Items.create({
            name, desc, price, type, images: img, hotel: req.user
        })
        res.json({ message: "item add success" })
    })
})
exports.readMenu = asyncHandler(async (req, res) => {
    const result = await Items.find({ hotel: req.user })
    res.json({ message: "item read success", result })
})
exports.updateMenu = asyncHandler(async (req, res) => {
    // await Items.findByIdAndUpdate(req.body)
    res.json({ message: "item update success" })
})
exports.deleteMenu = asyncHandler(async (req, res) => {
    const { iid } = req.params
    const result = await Items.findByIdAndDelete(iid)
    for (const item of result.images) {
        await cloud.uploader.destroy(path.basename(item).split(".")[0])
    }
    await Items.findByIdAndDelete(iid)
    res.json({ message: "item delete success" })
})

exports.totalSales = asyncHandler(async (req, res) => {
    const result = await Orders.aggregate([
        // Step 1: Match only delivered orders
        {
            $match: { status: "deliver" }
        },

        // Step 2: Unwind products
        {
            $unwind: "$products"
        },

        // Step 3: Convert qty to integer
        {
            $addFields: {
                "products.qty": { $toInt: "$products.qty" }
            }
        },

        // Step 4: Lookup product details from menu
        {
            $lookup: {
                from: "menus", // MongoDB auto-pluralizes model names
                localField: "products.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },

        // Step 5: Unwind the productDetails array
        {
            $unwind: "$productDetails"
        },

        // Step 6: Convert price to number
        {
            $addFields: {
                "productDetails.price": { $toDouble: "$productDetails.price" }
            }
        },

        // Step 7: Calculate line total = qty * price
        {
            $addFields: {
                lineTotal: { $multiply: ["$products.qty", "$productDetails.price"] }
            }
        },

        // Step 8: Group to calculate total revenue
        {
            $group: {
                _id: null, // if you want total revenue only; change to "$user" for per-user revenue
                totalRevenue: { $sum: "$lineTotal" }
            }
        }
    ])
    res.json(result)

})