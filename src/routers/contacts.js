import express from "express";
import {
  fetchContacts,
  fetchContactById,
  createContact,
  patchContact,
  deleteContact
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = express.Router();

router.get("/", ctrlWrapper(fetchContacts));
router.get("/:contactId", ctrlWrapper(fetchContactById));
router.post("/", ctrlWrapper(createContact)); 
router.patch('/:contactId', ctrlWrapper(patchContact));
router.delete("/:contactId", ctrlWrapper(deleteContact));
export default router;
