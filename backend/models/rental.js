const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 10,
		maxLength: 50
	},
	isGold:{
		type: Boolean,
		default: false
	},
	phone: {
		type: Number,
		required: true
	}
})

const movieSchema = new mongoose.Schema({
	title:{
		type: String,
		required: true,
		trim: true,
		minLength: 5,
		maxLength: 255,
	},
	dailyRentalRate:{
		type: Number,
		required:true,
		min:0,
		max: 255
	}
})

const rentalSchema = new mongoose.Schema({
	customer:{
		type: customerSchema,
		required: true
	},
	movie: {
		type: movieSchema,
		required: true
	},
	dateOut:{
		type: Date,
		default: Date.now(),
		required: true,
	},
	dateReturned: {
		type: Date,
	},
	rentalFee:{
		type: Number,
		min: 0
	}
})



function validateRental(rental){
	const schema = Joi.object({
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	})
	return schema.validate(rental);
}

const Rental = mongoose.model('Rental', rentalSchema);

exports.Rental = Rental;
exports.validate = validateRental; 