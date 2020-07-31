const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true,
		minLength: 5,
		maxLength: 50
	},
	email:{
		type: String,
		required: true,
		minLength: 5,
		maxLength: 255
	},
	isAdmin:{
		type:Boolean,
	},
	password:{
		type: String,
		minLength: 5,
		maxLength: 1024,
		required: true
	}
})
userSchema.methods.generateToken = function(){
	const token = jwt.sign({_id:this._id, isAdmin: this.isAdmin}, process.env['jwtPrivateKey']);
	return token
}
const User = mongoose.model('User', userSchema);

function validateUser(user){
	const schema = Joi.object({
		name: Joi.string().required().min(5).max(50),
		email: Joi.string().required().min(5).max(255).email(),
		password: Joi.string().min(5).max(255).required()
	})
	return schema.validate(user)
}
exports.User = User;
exports.validate = validateUser;