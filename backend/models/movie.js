const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('../models/genre')

const movieSchema = new mongoose.Schema({
	title:{
		type: String,
		required: true,
		trim: true,
		minLength: 5,
		maxLength: 255,
	},
	genre: {
		type: genreSchema,
		required: true
	},
	numberInStock:{
		type: Number,
		required:true,
		min:0,
		max: 255
	},
	dailyRentalRate:{
		type: Number,
		required:true,
		min:0,
		max: 255
	}
})

function validateMovie(movie){
	const schema = Joi.object({
		title: Joi.string().min(3).max(255).required(),
		genreId: Joi.objectId().required(),
		numberInStock: Joi.number().min(0).required(),
		dailyRentalRate: Joi.number().min(0).required()
	})
	return schema.validate(movie);
}

const Movie = mongoose.model('Movie', movieSchema);

exports.Movie = Movie;
exports.validate = validateMovie;