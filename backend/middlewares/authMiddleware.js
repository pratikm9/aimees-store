import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/usersModel.js';

const protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decode.id).select('-password'); //new key value pair called as user
			next();
		} catch (error) {
			console.error(error);
			throw new Error('Not Authorize, token failed');
		}
	} else {
		throw new Error('No token found');
	}
});

const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401); //not authorized
		throw new Error('Not authorized. Only for admin users');
	}
};

export { protect, admin };
