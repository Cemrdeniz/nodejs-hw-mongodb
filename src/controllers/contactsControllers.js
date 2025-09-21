import { getAllContacts } from '../services/contacts.js';
import { getContactById } from '../services/contacts.js';

export const fetchContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
      data: []
    });
  }
};
export const fetchContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
      data: null,
    });
  }
};