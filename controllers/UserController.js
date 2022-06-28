import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt';

import UserModel from '../models/User.js'

//[ua] Реєстрація
export const register = async (req, res) => {
    try {
        //[ua] генерація хешу для паролю
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        //[ua] створення user моделі
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            userAdress: req.body.userAdress,
            avatarUrl: req.body.avatarUrl,
            isAdmin: false,
        });
        

        const user = await doc.save();
        //[ua]створення токену
        const token = jwt.sign({
            _id: user._id,
            isAdmin: user.isAdmin,
        },
            "secret123",
            {
                expiresIn: '30d',
            }

        );

        //[ua]видалення хешу паролю з відображення
        const { passwordHash, ...userData } = user._doc;

        //[ua] якщо все нормально, то повертаємо данні в json форматі.
        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не вдалося зареєструватися!",
        });
    }
}   
//[ua] Логін
export const login = async (req, res) => {
    try {
        //знаходимо юзера
        const user = await UserModel.findOne({email: req.body.email});

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass || !user){
            return res.status(404).json({
                message:"Не вдалося авторизуватися",
            });
        }

        const token = jwt.sign({
            _id: user._id,
            isAdmin: user.isAdmin,
        },
            "secret123",
            {
                expiresIn: '30d',
            }

        );

        const { passwordHash, ...userData } = user._doc;


        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося авторизуватися",
        });
    }
}

export const getMe = async (req,res)=>{
    try{

        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message:"Користувача не знайдено"
            });
        }
        

        const { passwordHash, ...userData } = user._doc;
        res.json({userData});
    }catch (err){
        console.log(err);
        res.status(403).json({
            message:"Немає доступу",
        });
    }
}

export const updateMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        await UserModel.updateOne({
           
            _id: user._id
        },
            {
                fullName: req.body.fullName,
                userAdress: req.body.userAdress,
                avatarUrl: req.body.avatarUrl,
            });

            res.json({
                success: true
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося оновити запис",
        });
    }
}