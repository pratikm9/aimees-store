import asyncHandler from 'express-async-handler';
import User from '../models/usersModel.js';
import generateToken from '../utlils/generateToken.js';

//@desc Auth users and get token
//@route GET /api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && user.matchPassword(password)) {
		res.json({
			//never send the password
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(401); //Unauthorized
		throw new Error('Invalid Email or Password');
	}
});

//@desc Get User profile
//@route GET /api/users/profile
//@access private

const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.admin,
		});
	} else {
		res.status(404);
		throw new Error('User Not Found');
	}
});

//@desc Register New User
//@route POST /api/users
//@access public

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExits = await User.findOne({ email });

	if (userExits) {
		res.status(400); //Bad request
		throw new Error('User already exists');
	}

	const user = await User.create({ name, email, password });

	if (user) {
		//201-successfully created
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400); //Bad request
		throw new Error('Invalid user data');
	}
});

//@desc Update User Profile
//@route PUT /api/users/profile
//@access private

const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		//updating email and name by user - req.body.name if he is not updating then keep the same details 'user.name' and 'user.email'
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			//to avoid double hashing we have used if condition in password
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

//@desc Get all users
//@route GET /api/users
//@access private/admin

//This is for admins only because they will only get full list admins

const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.json(users);
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access private/admin

const deleteUser = asyncHandler(
	asyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);

		if (user) {
			await user.remove();
			res.json({ message: 'User Deleted' });
		} else {
			res.status(404);
			throw new Error('User not found');
		}
	})
);

//@desc Get user by ID
//@route GET /api/users/:id
//@access private/admin

const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');
	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

//@desc Update user
//@route PUT /api/users/:id
//@access private/admin

const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin; //already it is boolean so no ||

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

export {
	authUser,
	getUserProfile,
	registerUser,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
};
