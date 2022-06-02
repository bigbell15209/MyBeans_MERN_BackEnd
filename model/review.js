const mongoose = require("mongoose")


const ReviewSchema = new mongoose.Schema({
    beanId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "bean"
	},
    buyerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "buyer"
	},
    rate: {
		type: String
	},
    comment: {
		type: String
	},
    lastUpdated:{
        type: Date
    }
})

const Review = mongoose.model("review", ReviewSchema)

module.exports = Review