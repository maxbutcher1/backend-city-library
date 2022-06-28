import {body} from "express-validator"

export const loginValidation = [
    body("email", "Не віррний формат пошти.").isEmail(),
    body("password", "Пароль має бути більше 5 символів.").isLength({min: 5}),
];

export const registerValidation = [
    body("email", "Не віррний формат пошти.").isEmail(),
    body("password", "Пароль має бути більше 5 символів.").isLength({min: 5}),
    body("fullName", "Ім'я має бути більше 3 символів.").isLength({min: 3}),
    //body("userAdress", "Адреса має бути більше 3 символів").optional().isLength({min: 3}),
    //body("avatarUrl", "Не вірний формат посилання.").optional().isString().isURL(),
];

export const updateMeValidation = [
    body("fullName", "Ім'я має бути більше 3 символів.").optional().isLength({min: 3}),
    body("userAdress", "Адреса має бути більше 3 символів").optional().isLength({min: 3}),
    body("avatarUrl", "Не вірний формат посилання.").optional().isString().isURL(),
];

export const postCreateValidation = [
    body("title", "Не віррний формат пошти.").isLength({min:3}).isString(),
    body("text", "Пароль має бути більше 5 символів.").isLength({min: 10}).isString(),
    body("tags", "не вірний формат тегів.(Вкажіть масив)").optional().isString(),
    body("imageUrl", "Не вірний формат посилання.").optional().isString(),
];