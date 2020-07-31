const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi')
const {User} = require('../models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
// const auth = require('../middleware/auth')
// const config = require('config');

router.post('/', async (req, res) => {
	const {error} = validate(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({email:req.body.email});
	if(!user) return res.status(400).send('Invalid email OR password');

	const isValidPassword = bcrypt.compare(user.password, req.body.password);
	if(!isValidPassword) return res.status(400).send('Invalid email OR password');
	const token = user.generateToken();

	return res.status(200).send(token);
})

function validate(user){
	const schema = Joi.object({
		email: Joi.string().required().min(5).max(255).email(),
		password: Joi.string().min(5).max(1024).required()
	})
	return schema.validate(user);
}

module.exports = router