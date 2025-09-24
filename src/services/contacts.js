import Contact from '../models/contact.js';
import createHttpError from 'http-errors';

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


export const updateContact = async ({ userId, contactId, data, file }) => {
  if (file) {
    const uploaded = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) throw createHttpError(500, "Failed to upload image.");
      data.photo = result.secure_url;
    }).end(file.buffer);
  }

  const doc = await Contact.findOneAndUpdate({ _id: contactId, userId }, data, { new: true });
  if (!doc) throw createHttpError(404, 'Not found');
  return doc;
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

export const createContact = async ({ userId, data, file }) => {
  if (file) {
    const uploaded = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) throw createHttpError(500, "Failed to upload image.");
      data.photo = result.secure_url;
    }).end(file.buffer);
  }

  const doc = await Contact.create({ ...data, userId });
  return doc;
};

