const mongoose = require("mongoose")

const BeanSchema = new mongoose.Schema({
    vendorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "vendor"
	},
    origins: [{
		type: String
	}],
    species: [{
		type: String
	}],
    roastingLevel:{
        type: String
    },
    description:{
        type:String
    },
    price:{
        type:Number
    },
    dateCreated:{
        type: Date
    },
    reviews: [
		{
			review: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "review"
			}
		}
	],
    lastUpdated:{
        type: Date
    }
})

const Bean = mongoose.model("bean", BeanSchema)

module.exports = Bean