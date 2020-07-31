const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config()

const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users');
const auth = require('./routes/auth');


if(!process.env['jwtPrivateKey']){
	console.log('FATAL ERROR jwtPrivateKey required ')
	process.exit(1);	
}
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.connect(process.env['db'],{useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('Connected ...'))
	.catch(err => console.log(err));

app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use((error, req, res, next) => {
	res.status(500).send(ex.details[0].message)
})
app.listen(3000,function(){
	console.log('app is running on port 3000')
});