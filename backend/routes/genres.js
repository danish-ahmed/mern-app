const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');

router.get('/', async function(req, res){
	const genres = await Genre.find();
	if(!genres) return res.status(404).send({error: 'No genres Found'});
	return res.status(200).send(genres);
})

router.get('/:id', async function(req, res){
	const id = req.params.id; 
	try{
		const genre = await Genre.findById(id);
		if(!genre) return res.status(404).send('Not Found');
		return res.status(200).send(genre);
	}catch(ex){
		res.status(500).send({error:ex.message})
	}
})

router.post('/', async function(req, res){
	const {error} = validate(req.body);
	if(error) return res.status(500).send(error.details[0].message);
	const genre = new Genre({
		name: req.body.name
	});
	try{
		await genre.save();
		res.status(200).send(genre);
	}catch(ex){
		res.status(500).send({errors:ex.message})
	}

})	

router.put('/:id', async function(req, res){
	const id = req.params.id;
	const {error} = validate(req.body);
	if(error) return res.status(500).send(error.details[0].message);
	try{
		const genre = await Genre.findByIdAndUpdate(id, {
			name: req.body.name
		},{new:true});
		if(!genre) return res.status(404).send('Genre with the given ID not found');
		return res.status(200).send(genre);
	}catch(ex){
		return res.status(500).send({errors:ex.message})
	}
})

router.delete('/:id', async function(req,res){
	const id = req.params.id;
	try{
		const result = await Genre.findByIdAndRemove(id);
		if(!result) return res.status(404).send('The Genre with the given ID not found')
		return res.status(200).send(result);
	}catch(ex){
		res.status(500).send(ex.message);
	}
})

module.exports = router;