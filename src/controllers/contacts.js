import createError from "http-errors";
import * as contactsService from "../services/contacts.js";


export const fetchContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = "name",
      sortOrder = "asc",
      type,
      isFavourite
    } = req.query;

    const result = await contactsService.getAllContactsPaginated({
      page: parseInt(page),
      perPage: parseInt(perPage),
      sortBy,
      sortOrder,
      type,
      isFavourite
    });

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.json(contact);
};


export const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, "name, phoneNumber and contactType are required");
  }

  const newContact = await contactsService.addContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

export const patchContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const body = req.body;

    
    const updatedContact = await contactsService.updateContact(contactId, body);

    if (!updatedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await contactsService.deleteContact(contactId);

    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }

    
    res.status(200).json({
      status: 200,
      message: 'Contact successfully deleted!',
      data: deletedContact, 
    });
  } catch (error) {
    next(error);
  }
};

