const Joi = require('joi');

const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
	isGold:{
		type: Boolean,
		default: false
	},
	name:{
		type: String,
		required: true,
		minLength: 3,
		maxLength: 255
	},
	phone:{
		type: Number,
		required: true,
		validate:{
			validator: function(v){
				return v.length == 11;
			},
			message: "Phone Number Must be 11 characters long"
		}
	}
});

const Customer = mongoose.model('Customer', customerSchema);


//VALIDATE METHOD
function validateCustomer(customer){
	const schema = Joi.object({
		isGold: Joi.boolean(),
		name: Joi.string().min(3).max(255).required(),
		phone: Joi.number().required()
	})
	return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;