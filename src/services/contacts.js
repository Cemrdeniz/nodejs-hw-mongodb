import { Contact } from '../db/Contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (err) {
    throw new Error('Error fetching contacts: ' + err.message);
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (err) {
    throw new Error('Error fetching contact by ID: ' + err.message);
  }
};


export const addContact = async (data) => {
  try {
    const newContact = new Contact(data);
    await newContact.save();
    return newContact;
  } catch (err) {
    throw new Error('Error creating contact: ' + err.message);
  }
};

export const updateContact = async (contactId, body) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true, 
    });

    return updatedContact;
  } catch (err) {
    throw new Error('Error updating contact: ' + err.message);
  }
};

export const deleteContact = async (contactId) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (err) {
    throw new Error('Error deleting contact: ' + err.message);
  }
};