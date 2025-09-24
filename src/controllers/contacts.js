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

    const userId = req.user._id; 

    const result = await contactsService.getAllContactsPaginated({
      userId, 
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
    const userId = req.user._id;  
    const contactData = {
      ...req.body,
      userId,  
    };

    const newContact = await Contact.create(contactData);  

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
    const { contactId } = req.params;
    const { body, file } = req;

    if (file) {
      const photoUrl = await uploadToCloudinary(file);
      body.photo = photoUrl;
    }


    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId: req.user._id },
      body,
      { new: true }
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (err) {
    next(err);
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
