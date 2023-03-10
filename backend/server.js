import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/database.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
//import path from 'path';

dotenv.config();

connectDB();

const app = express();
app.use(express.json()); //body parsing

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
/*  any user came on link '/api/users' then 
- It will go on the userRoutes - '/login'
- After that it will go to authUser(- userController) and there is function which will run  
*/

//PAYPAL CLIENT ID ROUTE
app.get('/api/config/paypal', (req, res) => {
	res.send(process.env.PAYPAL_CLIENT_ID);
});

//CREATE A STATIC FOLDER
const __dirname = path.resolve(); //director name- dunder- it will give root folder url or path
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/build')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, './frontend/build/index.html'));
	});
} else {
	app.get('/', (req, res) => {
		res.send('API is running');
	});
}

//Error Middlewares
app.use(notFound);
app.use(errorHandler);

//static files
//app.use(express.static(path.join()))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(
		`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
	);
});
