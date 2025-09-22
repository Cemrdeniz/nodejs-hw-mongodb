import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  fetchContacts,
  fetchContactById,
  createContact,
  patchContact,
  deleteContact,
} from "../controllers/contacts.js";

import { validateBody } from "../validators/validateBody.js";
import { contactCreateSchema, contactUpdateSchema } from "../validators/contactSchemas.js";
import { isValidId } from "../validators/isValidId.js";

const router = express.Router();

router.get("/", ctrlWrapper(fetchContacts));
router.get("/:contactId", isValidId, ctrlWrapper(fetchContactById));
router.post("/", validateBody(contactCreateSchema), ctrlWrapper(createContact));
router.patch("/:contactId", isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContact));
router.delete("/:contactId", isValidId, ctrlWrapper(deleteContact));

export default router;
