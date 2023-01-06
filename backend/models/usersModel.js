import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			requried: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
		role: {
			type: String,
			required: true,
			default: 'customer',
		},
	},
	{ timestamps: true }
);

userSchema.methods.matchPassword = async function (enterPassword) {
	return await bcrypt.compare(enterPassword, this.password);
};

/* 
-mongoose- userSchema has methods and added new method matchPassword (matchPassword is our own customed method)
-Above function keyword is used because 'this' does not work with Arrow function
-this.password - because it will belong to registerd user in the database - if john password is enterend then it will matched with password present in the database
-parameter(enterPassword) - user will type that password is given as parameter
- second line-
		- await because it is async operation
		- bcrypt has inbuilt function called 'compare' - it will compare the user entered password and password stored in the database
		-matchPassword is send to userCOntroller

flow of code- 'enterpassword' and 'password from  req.body userModel' is compared and checked and if the password is truthy then if condition in userController is activated 
*/

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
