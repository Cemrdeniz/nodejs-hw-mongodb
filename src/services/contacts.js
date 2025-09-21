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