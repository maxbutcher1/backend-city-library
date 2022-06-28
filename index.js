import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import dotenv from "dotenv"

import {UserController,PostController} from './controllers/index.js'
import { loginValidation, postCreateValidation, registerValidation, updateMeValidation } from './validations.js';
import {handleValidationErrors, checkAuth} from './utils/index.js'

dotenv.config();
//#region [en]Mongoose connect | [ua]Підключення mongoose
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("DB OK"); })
    .catch((err) => { console.log("DB error", err); });

//#endregion

//#region [en]Express configuration | [ua]Кофігурація express
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads/', express.static('uploads'));
//#endregion

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

//#region User
app.post("/account/register", registerValidation, handleValidationErrors, UserController.register);
app.post("/account/login", loginValidation, handleValidationErrors, UserController.login);
app.get("/account/me", checkAuth, UserController.getMe);
app.patch("/account/me", checkAuth,updateMeValidation ,handleValidationErrors, UserController.updateMe);
//#endregion

//#region Book post
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
//#endregion

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    });
});





app.listen(4000, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server Ok");
});