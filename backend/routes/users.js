const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, validate} = require('../models/user');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/dashboard', [auth, admin], async (req, res) => {
	const user_id = req.user._id;
	const user = await User.findById(user_id).select('-password');
	return res.send(user);  
})

router.post('/', async (req, res) => {
	const {error} = validate(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({email: req.body.email});
	
	if(user) return res.status(400).send('User with this email already exist');
	
	user = new User(_.pick(req.body,['name', 'email', 'password']))
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	try{
		await user.save();
		// const token = jwt.sign({_id: user._id}, process.env['jwtPrivateKey'])
		const token = user.generateToken();
		res.status(200).header('x-auth-token',token).send(_.pick(user, ['_id','name','email']));
	}catch(ex){
		next(ex)
	}

})

module.exports = router