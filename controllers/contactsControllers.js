const {
    getAllContacts,
    getContactById,
    addContact,
    changeContactById,
    deleteContactById,
    updateFavoriteById,
} = require('../services/contactsService')

const {RequestError} = require("../helpers");
const {schemas} = require("../models/contact")

const getContactsController = async (req, res) => {
    const {_id: owner} = req.user; // Отримуємо id користувача який був визначений authenticate
    const {page = 1, limit = 10} = req.query; // Пагінація все що передається після ?
    const skip = (page - 1) * limit;
    const result = await getAllContacts(owner, skip, limit);
        res.status(200).json(result);
}

const getContactByIdNewController = async (req, res) => {
    const {contactId} = req.params;
    const {_id: owner} = req.user;
        const result = await getContactById(contactId, owner);
        res.status(200).json(result);
}

const addNewContactController = async (req, res) => {
    const {error} = schemas.addSchema.validate(req.body);
        if(error) {
            throw RequestError(400, error.message)
        }
        const {_id: owner} = req.user;
        const result = await addContact(req.body, owner);
        res.status(201).json(result);
}

const editContactController = async (req, res) => {
    const {error} = schemas.addSchema.validate(req.body);
        if(error) {
            throw RequestError(400, error.message)
        }
        const {contactId} = req.params;
        const {_id: owner} = req.user;
        const result = await changeContactById(contactId, req.body, owner);
        res.status(200).json(result);
}

const deleteContactController = async (req, res) => {
    const {contactId} = req.params;
    const {_id: owner} = req.user;
        await deleteContactById(contactId, owner);
        res.status(200).json({message: "contact deleted"});
}

const updateFavoriteByIdController = async (req, res) => {
    const {error} = schemas.updateFavoriteSchema.validate(req.body);
        if(error) {
            throw RequestError(400, error.message)
        }
    const {contactId} = req.params;
    const {_id: owner} = req.user;
    const result = await updateFavoriteById(contactId, req.body, owner);
    res.status(200).json(result);
}

module.exports = {
    getContactsController,
    getContactByIdNewController,
    addNewContactController,
    editContactController,
    deleteContactController,
    updateFavoriteByIdController,
}
