const jwt = require('jsonwebtoken');

function auth(req, res, next){
	const token = req.header('x-auth-token');
	if(!token) return res.status(401).send('Access denied! invalid token');
	try{
		const decoded = jwt.verify(token, process.env['jwtPrivateKey']);
		req.user = decoded;
		next();
	}catch(ex){
		return res.status(400).send('invalid token')
	}

}

module.exports = auth;