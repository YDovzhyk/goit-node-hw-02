const express = require("express");
const { ctrlWrapper } = require("../../helpers");
const ctrl = require("../../controllers/authController");
const {validateBody, authenticate, upload} = require("../../middlewares")
const {schemas} = require("../../models/user");
const router = express.Router();

// signup
router.post("/register", validateBody(schemas.registerSchema), ctrlWrapper(ctrl.registerController))

router.get("/verify/:verificationToken", ctrlWrapper(ctrl.verifyController))

router.post("/verify", validateBody(schemas.emailSchema), ctrlWrapper(ctrl.resendEmailController))

// signin
router.post("/login", validateBody(schemas.loginSchema), ctrlWrapper(ctrl.loginController))

router.get("/current", authenticate, ctrlWrapper(ctrl.getCurrentController))

router.get("/logout", authenticate, ctrlWrapper(ctrl.logoutController))

router.patch("/avatars", authenticate, upload.single("avatar"), ctrlWrapper(ctrl.updateAvatar))

module.exports = router;