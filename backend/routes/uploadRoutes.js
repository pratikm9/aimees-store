import path from 'path'; //built-in node module - it will help to generate path- mostly used for image
import express from 'express';
import multer from 'multer';

const router = express.Router();

//documentation as per multer
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads/'); //cb-call back function , 'upload/' - folder- / is important to give
	},
	filename(req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()} ${path.extname(file.originalname)}`
		);
	},
});

function checkFileTypes(file, cb) {
	//which format of file you want to accept eg- |docx|pdf
	const filetypes = /jpeg|png|jpg/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); //tolowercase because some extension are in capital
	const mimetype = filetypes.test(file.mimetype); //check binary type of file

	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb('Only images are allowed');
	}
}

const upload = multer({
	storage,
	fileFilter: function (req, file, cb) {
		checkFileTypes(file, cb);
	},
});

router.post('/', upload.single('image'), (req, res) => {
	res.send(`/${req.file.path}`);
}); // we want to upload single image so single we can also choose arrays option for mulitple uploads

export default router;
