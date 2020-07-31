const express = require('express');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');


const router = express.Router();

router.get('/', async (req, res) => {
	const movies = await Movie.find();
	if(!movies) return res.status(404).send('Movies not found');
	return res.status(200).send(movies)
})

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const movie = await Movie.findById(id);
	if(!movie) return res.status(404).send('Movies not found');
	return res.status(200).send(movie)
})

router.post('/', async(req, res) => {
	const {error} = validate(req.body);
	console.log(error)
	if(error) return res.status(500).send(error.details[0].message);
	const genre = await Genre.findById(req.body.genreId);
	let movie = new Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate
	});
	try{
		await movie.save();
		return res.status(200).send(movie);
	}catch(ex){
		return res.status(500).send(ex.message);		
	}
})

router.put('/:id', async(req, res) => {
	const id = req.params.id;
	const {error} = validate(req.body);
	if(error) return res.status(500).send(error.details[0].message);
	const genre = Genre.findById(req.body.genreId);
	try{
		const movie = await findByIdAndUpdate({
			title: req.body.title,
			genere: {
				_id: genre.id,
				name: genre.name
			},
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate
		}, {new: true});
		if(!movie) res.status(404).send('Movie with the given ID not Found');
		return res.status(200).send(movie);
	}catch(ex){
		return res.status(500).send(ex.details[0].message);		
	}
})

router.delete('/:id', async (req, res) => {
	const id = req.params.id;
	const movie = Movie.findByIdAndRemove(id);
	if(movie) return res.status(404).send('Movie with the give ID not Found');
	return res.status(200).send(movie);
})

module.exports = router;