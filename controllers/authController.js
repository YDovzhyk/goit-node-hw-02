const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const shortid = require("shortid");
const Jimp = require('jimp');

const fs = require("fs/promises");
const path = require("path");

const {User} = require("../models/user");
const {SECRET_KEY, BASE_URL} = process.env;

const {RequestError, sendMail} = require("../helpers");

const registerController = async(req, res)=> {
    const {username, email, password} = req.body;

    const user = await User.findOne({email});
    if(user) {
        throw RequestError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const avatarURL = gravatar.url(email) // добавляємо посилання на аватар gravatar та записуємо його у схему

    const verificationToken = shortid.generate(); 

    const newUser = await User.create({username, email, password: hashPassword, avatarURL, verificationToken});

    const mail = {
        to: email,
        subject: "Site registration confirmation",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Follow the link to confirm your registration</a>`
    }

    await sendMail(mail)

    res.status(201).json({
        "user": {
            "username": newUser.username,
            "email": newUser.email,
            "subscription": newUser.subscription,
            "verificationToken": newUser.verificationToken,
        }
    })
};

const loginController = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user) {
        throw RequestError(401, "Invalid email or password"); // throw RequestError(401, "Invalid email");
    }

    if(!user.verify) {
        throw RequestError(401, "Email not verify"); // Якщо користувач ще не підтвердив свій mail
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw RequestError(401, "Invalid email or password"); // throw RequestError(401, "Invalid password");
    }

    const paylaod = {
        id: user._id,
    }

    const token = jwt.sign(paylaod, SECRET_KEY, {expiresIn: "23h"})
    await User.findByIdAndUpdate(user._id, {token})

    res.json({
        token,
        user: {
            "email": user.email,
            "subscription": user.subscription
        }
    })
};

const getCurrentController = async(req, res)=> {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
};

const logoutController = async(req, res) => {
    const {_id} = req.user;

    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json({message: "logout success"});
}

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const updateAvatar = async (req, res)=> {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);

    const resizeAvatar = await Jimp.read(resultUpload);
    await resizeAvatar.resize(250, 250).write(resultUpload); // Обробляэмо аватарку пакетом jimp і ставимо для неї розміри 250 на 250

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(req.user._id, {avatarURL});

    res.json({
        avatarURL
    })
}

const verifyController = async(req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken})

    if(!user) {
        throw RequestError(404, "User not found")
    }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""})

    res.json({
        message: "Verification successful"
    })
}

const resendEmailController = async(req, res) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user) {
        throw RequestError(404, "User not found")
    }

    if(user.verify) {
        throw RequestError(400, "Verification has already been passed")
    }

    const mail = {
        to: email,
        subject: "Site registration confirmation",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Follow the link to confirm your registration</a>`
    }

    await sendMail(mail);

    res.json({
        message: "Verification email sent"
    })
}

module.exports = {
    registerController,
    loginController,
    getCurrentController,
    logoutController,
    updateAvatar,
    verifyController,
    resendEmailController,
}