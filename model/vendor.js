//student number, password, first name, last name, address, city, phone number, email, program

const mongoose = require("mongoose")

const VendorSchema = new mongoose.Schema({
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
    shopName:{
        type: String
    },
    phoneNumber:{
        type: String
    },
	beans: [
		{
			bean: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "bean"
			}
		}
	]
})

// Set the 'fullname' virtual property
VendorSchema.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName
	})
	.set(function (fullName) {
		const splitName = fullName.split(" ")
		this.firstName = splitName[0] || ""
		this.lastName = splitName[1] || ""
	})

const Vendor = mongoose.model("vendor", VendorSchema)

module.exports = Vendor
