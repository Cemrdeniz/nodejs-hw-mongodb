import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  fetchContacts,
  fetchContactById,
  createContact,
  patchContact,
  deleteContact,
} from "../controllers/contacts.js";
import authenticate from '../middlewares/authenticate.js';
import { validateBody } from "../validators/validateBody.js";
import { contactCreateSchema, contactUpdateSchema } from "../validators/contactSchemas.js";
import { isValidId } from "../validators/isValidId.js";

const router = express.Router();

// <<< TÜM ROTALARI authenticate middleware'iyle koruyoruz >>>

router.get("/", authenticate, ctrlWrapper(fetchContacts));
router.get("/:contactId", authenticate, isValidId, ctrlWrapper(fetchContactById));
router.post("/", authenticate, validateBody(contactCreateSchema), ctrlWrapper(createContact));
router.patch("/:contactId", authenticate, isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContact));
router.delete("/:contactId", authenticate, isValidId, ctrlWrapper(deleteContact));

export default router;
