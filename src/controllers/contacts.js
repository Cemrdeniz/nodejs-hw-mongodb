import Contact from '../models/contact.js';
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

    const userId = req.user._id; // <<< Token'dan gelen kullanıcı ID

    const result = await contactsService.getAllContactsPaginated({
      userId, // <<< Bunu ekle
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
  console.log("Authenticated user ID:", req.user?._id);

};


export const createContact = async (req, res, next) => {
  try {
    const userId = req.user._id;  // authenticate middleware sayesinde req.user var
    const contactData = {
      ...req.body,
      userId,  // kullanıcı id'sini ekliyoruz
    };

    const newContact = await Contact.create(contactData);  // Burada Contact modelini kullanıyoruz

    res.status(201).json({
      status: 'success',
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};


export const fetchContactById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;

    const contact = await contactsService.getContactById(contactId, userId);

    if (!contact) {
      throw createError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: "Contact found",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};



export const patchContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;
    const body = req.body;

    const updatedContact = await contactsService.updateContact(contactId, userId, body);

    if (!updatedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: "Successfully updated the contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;

    const deletedContact = await contactsService.deleteContact(contactId, userId);

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
