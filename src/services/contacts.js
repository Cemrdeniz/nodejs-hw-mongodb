import Contact from '../models/contact.js';


export const getAllContactsPaginated = async ({
  userId, 
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  type,
  isFavourite
}) => {
  try {
    const filter = { userId }; 

    if (type) filter.contactType = type;
    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === 'true';
    }

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




export const getContactById = async (contactId, userId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
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


export const updateContact = async (contactId, userId, updateData) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      updateData,
      { new: true }
    );
    return updatedContact;
  } catch (err) {
    throw new Error('Error updating contact: ' + err.message);
  }
};


export const deleteContact = async (contactId, userId) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });
    return deletedContact;
  } catch (err) {
    throw new Error('Error deleting contact: ' + err.message);
  }
};


export const getContactsPaginated = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  contactType,
  isFavourite,
}) => {
  try {
    const filter = { userId };
    if (contactType) filter.contactType = contactType;
    if (typeof isFavourite !== 'undefined') filter.isFavourite = isFavourite === 'true' || isFavourite === true;

    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage);

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

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
    throw new Error('Error fetching paginated contacts: ' + err.message);
  }
};
