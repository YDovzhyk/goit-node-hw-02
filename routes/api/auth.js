const express = require("express");
const { ctrlWrapper } = require("../../helpers");
const ctrl = require("../../controllers/authController");
const {validateBody, authenticate} = require("../../middlewares")
const {schemas} = require("../../models/user");
const router = express.Router();

// signup
router.post("/register", validateBody(schemas.registerSchema), ctrlWrapper(ctrl.registerController))
// signin
router.post("/login", validateBody(schemas.loginSchema), ctrlWrapper(ctrl.loginController))

router.get("/current", authenticate, ctrlWrapper(ctrl.getCurrentController))

router.get("/logout", authenticate, ctrlWrapper(ctrl.logoutController))

module.exports = router;