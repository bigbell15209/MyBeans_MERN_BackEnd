const graphql = require("graphql")
const User = require("../model/user")
const Buyer = require("../model/buyer")
const Vendor = require("../model/vendor")
const Review = require("../model/review")
const Bean = require("../model/bean")
const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcryptjs/dist/bcrypt")
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLFloat
} = graphql

const BeanType = new GraphQLObjectType({
	name:"Bean",
	fields:()=>({
		id:{
			type:GraphQLString
		},
        origins:{type:GraphQLString},
        species:{type:GraphQLString},
        roastingLevel:{
            type:GraphQLString
        },
        description:{
            type:GraphQLString
        },
        price:{
            type:GraphQLFloat
        },
        dateCreated:{
            type:GraphQLString
        },
        lastUpdated:{
            type:GraphQLString
        }
	})
})

const ReviewType = new GraphQLObjectType({
	name:"Review",
	fields:()=>({
		id:{
			type:GraphQLString
		},
		rate:{
            type:GraphQLFloat
        },
        comment:{
            type:GraphQLString
        },
		dateCreated:{
            type:GraphQLString
        },
        lastUpdated:{
            type:GraphQLString
        }
	})
})

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: {
			type: GraphQLString
		},
		email: { 
			type: GraphQLString 
		},
		token: 
		{ 
			type: GraphQLString 
		},
		role: {
			type: GraphQLString
		}
	})
})

const BuyerType = new GraphQLObjectType({
	name: "Buyer",
	fields: () => ({
		id: {
			type: GraphQLString
		},
		email: { type: GraphQLString },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		street: { type: GraphQLString },
		city: { type: GraphQLString },
        province: { type: GraphQLString },
		phoneNumber: { type: GraphQLString },
		reviews: 
            {
			type: new GraphQLList(ReviewType),
			async resolve(parent, args) {
				var reviews = []
				for (const reviewInfo of parent.reviews) {
					const review = await Review.findById(reviewInfo.review)
					if (review != null) {
						reviews.push(review)
					}
				}
				return reviews
			}
		},
		beans: {
			type: new GraphQLList(BeanType),
			async resolve(parent, args) {
				var beans = []
				for (const beanInfo of parent.beans) {
					const bean = await Bean.findById(beanInfo.bean)
					if (bean != null) {
						beans.push(bean)
					}
				}
				return beans
			}
		}

	})
})

const VendorType = new GraphQLObjectType({
	name:"Vendor",
	fields:()=>({
		id:{
			type:GraphQLString
		},
		email: { type: GraphQLString },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		street: { type: GraphQLString },
		city: { type: GraphQLString },
        province: { type: GraphQLString },
		phoneNumber: { type: GraphQLString },
		shopName:{type : GraphQLString},
		shopDescription:{type : GraphQLString},
		beans: {
			type: new GraphQLList(BeanType),
			async resolve(parent, args) {
				var beans = []
				for (const beanInfo of parent.beans) {
					const bean = await Bean.findById(beanInfo.bean)
					if (bean != null) {
						beans.push(bean)
					}
				}
				return beans
			}
		}

	})
})

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: () => ({
		buyer: {
			type: BuyerType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Buyer.findOne({ userId: args.id })
			}
		},
		review: {
			type: ReviewType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Review.findById(args.id)
			}
		},
		reviews: {
			type: new GraphQLList(ReviewType),
			resolve(parent, args) {
				return Review.find()
			}
		},
		bean: {
			type: BeanType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Bean.findById(args.id)
			}
		},
		beans: {
			type: new GraphQLList(BeanType),
			resolve(parent, args) {
				return Bean.find()
			}
		},
		searchBeans: {
			type: new GraphQLList(VendorType),
			args: 
			{ 
				origins:{type: GraphQLList},
				species:{type: GraphQLList},
				roastingLevel:{type:GraphQLString}
			},
			resolve(parent, args) {
				return Bean.find
				(
					{ 
						origins: args.origins,
						species: args.species,
						roastingLevel: args.roastingLevel
					}
				)
			}
		},
		bean_AllReviews: {
			type: BeanType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Bean.findById(args.id)
			}
		},
		vendor: {
			type: VendorType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Vendor.findOne({ userId: args.id })
			}
		},
		vendors: {
			type: VendorType,
			resolve(parent, args) {
				return Vendor.find()
			}
		},
		vendors_AllShops: {
			type: VendorType,
			resolve(parent, args) {
				return Vendor.find()
			}
		},
		vendor_ShopName:{
			type: VendorType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Vendor.findById(args.id)
			}
		},
		vendors_AllBeans:{
			type: VendorType,
			resolve(parent, args) {
				return Vendor.find()
			}
		},
		vendor_BeanNames:{
			type: VendorType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Vendor.findById(args.id)
			}
		},
		
		header: {
			type: GraphQLString,
			resolve(parent, args, context) {
				console.log(context.user)
				//return context
			}
		}
	})
})

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {

		createAndAssignReview:{
			type:ReviewType,
			args:{
				rate:{type:GraphQLFloat},
				comment:{type:GraphQLString},
				beanId:{type : new GraphQLNonNull(GraphQLString)},
				buyerId:{type : new GraphQLNonNull(GraphQLString)}
			},
			async resolve(parent, args){
				
				let review = new Review({
					rate:args.rate,
					comment:args.comment
				})
				await review.save()

				beanId = args.beanId
				bean = await Bean.findById( beanId )
				bean.reviews.push({ review })
				await bean.save()

				buyerId = args.buyerId
				buyer = await Buyer.findById( buyerId )
				buyer.reviews.push({ review })
				await buyer.save()

				result = await survey.save()
				
				return result

			}
		},

		updateReview: {
			type: ReviewType,
			args: {
				reviewId:{type: GraphQLString },
				rate:{type:GraphQLFloat},
				comment:{type:GraphQLString},
			},
			async resolve(parent, args) {
				const reviewInDb = await Review.findById(args.reviewId)
				reviewInDb.rate = args.rate
				reviewInDb.comment = args.comment

				return await reviewInDb.save()
			}
		},

		removeReview: {
			type: ReviewType,
			args: {
				reviewId: { type: new GraphQLNonNull(GraphQLString) },
				beanId:{type : new GraphQLNonNull(GraphQLString)},
				buyerId:{type : new GraphQLNonNull(GraphQLString)}
			},
			async resolve(parent, args) {
				const review = await Review.findByIdAndDelete(args.reviewId);

				const writer = await buyer.updateOne(
					{_id: buyerId},
					{
						$pull: {
							reviews: { review: args.reviewId }
						}
					}
				)
				writer.save();
				
				const bean = await bean.updateOne(
					{_id: beanId},
					{
						$pull:{
							reviews:{review:args.reviewId}
						}
					}
				)
				bean.save();

				return review
			}
		},

		addBeanOnCart:{
			type: BuyerType,
			args:{
				userId:{type: new GraphQLNonNull(GraphQLString) },
				beanId:{type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent,args){
				const buyer = await Buyer.findOne({userId: args.userId})
				buyer.beans.push({bean: args.beanId})
				result = await buyer.save()   

				return result
			}
		},	

		removeBeanOnCart:{
			type: BuyerType,
			args:{
				userId:{type: new GraphQLNonNull(GraphQLString) },
				beanId:{type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent,args){
				const buyer = await Buyer.updateOne(
					{userId: args.userId},
					{
						$pull:{
							beans:{bean:args.beanId}
						}
					}

				)
				return buyer
			}
		},


		updateBuyerInfo: {
			type: {BuyerType, UserType},
			args: {
				userId:{type: GraphQLString },
				password:{type: GraphQLString },
				street:{type: GraphQLString },
				city:{type: GraphQLString },
				province:{type: GraphQLString }
			},
			async resolve(parent, args) {
				const userInDb = await User.findById(args.userId)
				userInDb.password = args.password
				await userInDb.save()


				const buyerInDb = await Buyer.findById(args.userId)
				buyerInDb.street = args.street
				buyerInDb.city = args.city
				buyerInDb.province = args.province
				 
				return await buyerInDb.save()
			}
		},

		uploadBean:{
			type:BeanType,
			args:{
				origins:[{type: GraphQLString}],
				species:[{type: GraphQLString}],
				roastingLevel:{type: GraphQLString},
				description:{type: GraphQLString},
				price:{type: GraphQLFloat},
				vendorId:{type : new GraphQLNonNull(GraphQLString)}
			},
			async resolve(parent, args){
				let bean = new Bean({
					vendorId:args.vendorId,
					origins:args.origins,
					species:args.species,
					roastingLevel:args.roastingLevel,
					description:args.description,
					price:args.price
				})
				await bean.save()

				vendorId = args.vendorId
				vendor = await Vendor.findById( vendorId )
				vendor.beans.push({ bean })
				result = await vendor.save()

				
				return result

			}
		},

		editShopInfo:{
			type: VendorType,
			args: {
				userId:{type: GraphQLString },
				street:{type: GraphQLString },
				city:{type: GraphQLString },
				province:{type: GraphQLString },
				shopName:{type: GraphQLString},
				shopDescription:{type: GraphQLString}
			},
			async resolve(parent, args) {
				
				const vendorInDb = await Vendor.findById(args.userId)
				vendorInDb.street = args.street
				vendorInDb.city = args.city
				vendorInDb.province = args.province
				vendorInDb.shopName = args.shopName
				vendorInDb.shopDescription = args.shopDescription
				 
				return await vendorInDb.save()
			}
		},

		editBeanInfo:{
			type: BeanType,
			args: {
				origins:[{type: GraphQLString}],
				species:[{type: GraphQLString}],
				roastingLevel:{type: GraphQLString},
				description:{type: GraphQLString},
				price:{type: GraphQLFloat},

				beanId:{type : new GraphQLNonNull(GraphQLString)}
			},
			async resolve(parent, args) {
				
				const beanInDb = await Bean.findById(args.beanId)
				beanInDb.origins = args.origins
				beanInDb.species = args.species
				beanInDb.roastingLevel = args.roastingLevel
				beanInDb.description = args.description
				beanInDb.price = args.price
				 
				return await beanInDb.save()
			}
		},

		register: {
			type: UserType,
			args: {
				email: { type: GraphQLString },
				password: { type: GraphQLString },
				role: { type: GraphQLString },
				firstName: { type: GraphQLString },
				lastName: { type: GraphQLString },
				street: { type: GraphQLString },
				city: { type: GraphQLString },
				province: { type: GraphQLString },

				shopName: { type: GraphQLString },
				shopDescription: { type: GraphQLString },
				phoneNumber: { type: GraphQLString }
			},
			async resolve(parent, args) {
				const userInDb = await User.findOne({ email: args.email })
				if (userInDb != null) {
					throw new Error("Email exists. Use another one or login")
				}

				try {
					var user = new User()

					//Save password
					const salt = await bcrypt.genSalt(10)
					password = await bcrypt.hash(args.password, salt)
					user.password = password

					//Save user email
					user.email = args.email

					//Save user
					user.role = args.role

					user = await user.save()

					if (args.role === "buyer") {
						var buyer = new Buyer()
						buyer.userId = user._id
						buyer.email = args.email
						buyer.firstName = args.firstName
						buyer.lastName = args.lastName
						buyer.street = args.street
						buyer.city = args.city
						buyer.province = args.province

						await buyer.save()
					}

					if (args.role === "vendor") {
						var vendor = new Vendor()
						vendor.userId = user._id
						vendor.email = args.email
						vendor.firstName = args.firstName
						vendor.lastName = args.lastName
						vendor.street = args.street
						vendor.city = args.city
						vendor.province = args.province

						vendor.phoneNumber = args.phoneNumber
						vendor.shopName = args.shopName
						vendor.shopDescription = args.shopDescription
						await vendor.save()
					}

					const payload = {
						user: {
							id: user._id,
							email: user.email,
							role: user.role
						}
					}
					token = await jwt.sign(payload, config.get("jwtSecret"), {
						expiresIn: 360000
					})

					user.token = token

					return user
				} catch (err) {
					console.log(err)
				}
			}
		},
		login: {
			type: UserType,
			args: {
				email: { type: GraphQLString },
				password: { type: GraphQLString }
			},
			async resolve(parent, args) {
				let user = await User.findOne({ email: args.email })

				if (user == null) {
					throw new Error("Invalid credentials")
				}

				const isMatch = await bcrypt.compare(args.password, user.password)
				if (!isMatch) {
					throw new Error("Invalid credentials")
				}

				const payload = {
					user: {
						id: user.id,
						email: user.email,
						role: user.role
					}
				}

				token = await jwt.sign(payload, config.get("jwtSecret"), {
					expiresIn: 360000
				})

				user.token = token

				return user
			}
		}
	}
})








module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})