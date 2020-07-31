const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
	const rentals = await Rental.find().sort('-dateOut');
	if(!rentals) return res.status(404).send('No any rental(s) found');
	return res.status(200).send(rentals);
})

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if(error) res.status(500).send(error.details[0].message);
	
	const customer = await Customer.findById(req.body.customerId); 
	
	if(!customer) return res.status(500).send('Customer with the given ID not found');
	
	const movie = await Movie.findById(req.body.movieId);
	if(!movie) return res.status(500).send('Movie with the give ID not found');

	if(movie.numberInStock == 0) res.send(400).send('Movie not in stock');
	const rental = new Rental({
		customer:{
			_id: customer._id,
			name: customer.name,
			isGold: customer.isGold,
			phone: customer.phone
		},
		movie:{
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate
		},
	})

	try{
		new Fawn.Task()
			.save('rentals',rental)
			.update('movies', {_id: movie.id},{
				$inc:{
					numberInStock:-1
				}
			})
			.run();
		res.status(200).send(rental)
	}catch(ex){
		res.status(500).send('Something failed during transaction');
	}
})

module.exports = router;