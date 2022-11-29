const Joi = require("joi");
const {Schema, model} = require('mongoose');

const {handleSaveErrors} = require("../helpers");

const subscriptionType = ["starter", "pro", "business"];
const emailRegexp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

const userSchema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Set password for user'],
        minlength: 6,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: emailRegexp,
    },
    subscription: {
        type: String,
        enum: subscriptionType,
        default: "starter"
    },
    token: {
        type: String,
        default: ""
    },
    avatarURL: {
        type: String,
        required: true,
    }
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleSaveErrors);

const registerSchema = Joi.object({
    username: Joi.string()
            .optional(),
    email: Joi.string()
            .pattern(emailRegexp)
            .required(),
    password: Joi.string()
            .min(6)
            .required(),
    subscription: Joi.string()
            .valid(...subscriptionType)
            .optional(),
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const User = model('user', userSchema);

const schemas = {
    registerSchema,
    loginSchema,
}

module.exports = {
    User,
    schemas,
};