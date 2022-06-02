//student number, password, first name, last name, address, city, phone number, email, program

const mongoose = require("mongoose")

const BuyerSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	},
	email: {
		type: String,
		unique: true,
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	street: {
		type: String
	},
	city: {
		type: String
	},
    province:{
        type: String
    },
	reviews: [
		{
			review: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "review"
			}
		}
	]
})

// Set the 'fullname' virtual property
BuyerSchema.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName
	})
	.set(function (fullName) {
		const splitName = fullName.split(" ")
		this.firstName = splitName[0] || ""
		this.lastName = splitName[1] || ""
	})

const Buyer = mongoose.model("buyer", BuyerSchema)

module.exports = Buyer
