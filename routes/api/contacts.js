const express = require("express");
const { ctrlWrapper } = require("../../helpers");
const {isValidId, authenticate} = require("../../middlewares")

const ctrl = require("../../controllers/contactsControllers")

const router = express.Router();

router.get("/", authenticate, ctrlWrapper(ctrl.getContactsController))

router.get("/:contactId", authenticate, isValidId, ctrlWrapper(ctrl.getContactByIdNewController))

router.post("/", authenticate, ctrlWrapper(ctrl.addNewContactController))

router.put("/:contactId", authenticate, isValidId, ctrlWrapper(ctrl.editContactController))

router.delete("/:contactId", authenticate, isValidId, ctrlWrapper(ctrl.deleteContactController))

router.patch("/:contactId/favorite", authenticate, isValidId, ctrlWrapper(ctrl.updateFavoriteByIdController))

module.exports = router;