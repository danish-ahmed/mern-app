const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {Customer, validate} = require('../models/customer');

router.get('/', async (req,res) => {
	try{
		const customers = await Customer.find();
		if(!customers) return res.status(404).send('Customers not found');
		return res.status(200).send(customers); 
	}catch(ex){
		return res.status(500).send(ex.message)
	}
})

router.get('/:id', async (req,res) => {
	const id = req.params.id
	try{
		const customer = await Customer.findById(id);
		if(!customer) return res.status(404).send('Customer with give ID was not found');
		return res.status(202).send(customer);
	}catch(ex){
		return res.status(500).send(ex.message)
	}	
})

router.post('/', async (req,res) => {
	const {error} = validate(req.body);
	console.log(error);
	if(error) return res.status(500).send(error.details[0].message);
	try{
		let customer = new Customer(req.body);
		customer = await customer.save();
		return res.status(200).send(customer);
	}catch(ex){
		return res.status(500).send(ex.message)
	}
})

router.put('/:id', async (req,res) => {
	const id = req.params.id;
	const {error} = validate(req.body);
	if(error) return res.status(500).send(error.details[0].message);
	try{
		customer = await Customer.findByIdAndUpdate(id,{
			name: req.body.name,
			isGold: req.body.isGold,
			phone: req.body.phone
			
		}, {new:true});
		if(!customer) return res.status(404).send('Customr with the given ID not found');
		return res.status(200).send(customer);
	}catch(ex){
		return res.status(500).send(ex.message)
	}
})

router.delete('/:id', async (req,res) => {
	const id = req.params.id;
	try{
		const customer = await Customer.findByIdAndRemove(id);
		if(!customer) return res.status(404).send('Customer with the given ID not found');
		return res.status(200).send(customer);
	}catch(ex){
		return res.status(500).send(ex.message)
	}
})

module.exports = router;