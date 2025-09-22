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

export const getAllContactsPaginated = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  type,
  isFavourite
}) => {
  try {
    const filter = {};
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage);

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const contacts = await Contact.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * perPage)
      .limit(perPage);

    return {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  } catch (err) {
    throw new Error("Error fetching contacts: " + err.message);
  }
};