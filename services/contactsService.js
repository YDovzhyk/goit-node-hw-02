const {Contact} = require('../models/contact');
const {RequestError} = require("../helpers");

const getAllContacts = async (owner, skip, limit) => { // userId - з models->contact
    const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit});
    // const result = await Contact.find({favorite: true}, "name phone"); // Пошук за вказаним параметром, виводяться тільки поля name і phone
    // const result = await Contact.find({favorite: true}, "-name -phone"); // Пошук за вказаним параметром, виводяться всі поля окрім name і phone
    return result;
};

const getContactById = async (contactId, owner) => {
    // const result = await Contact.findById(contactId);
    const result = await Contact.findOne({_id: contactId, owner}, "-createdAt -updatedAt");
        if(!result) {
            throw RequestError(404, "Not found")
        }
    return result;
};

const addContact = async (body, owner) => {
    const result = await Contact.create({...body, owner});
    return result;
};

const changeContactById = async (contactId, body, owner) => {
    // const result = await Contact.findByIdAndUpdate(contactId, body); // result - не оновлений
    const result = await Contact.findOneAndUpdate({_id: contactId, owner}, body, {new: true}); // result - оновлений
        if(!result) {
            throw RequestError(404);
        }
    return result;
};

const deleteContactById = async (contactId, owner) => {
    const result = await Contact.findOneAndRemove({_id: contactId, owner});
        if(!result) {
            throw RequestError(404)
        }
};

const updateFavoriteById = async (contactId, body, owner) => {
    if(Object.keys(body).length === 0) {
        throw RequestError(400);
    }
    const result = await Contact.findOneAndUpdate({_id: contactId, owner}, {$set: body}, {new: true});
        if(!result) {
            throw RequestError(404);
        }
    return result;
};

module.exports = {
    getAllContacts,
    getContactById,
    addContact,
    changeContactById,
    deleteContactById,
    updateFavoriteById,
}