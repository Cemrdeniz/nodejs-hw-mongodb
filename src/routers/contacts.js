import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { upload } from '../middlewares/upload.js';
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



// GET tüm kontaklar
router.get("/", authenticate, ctrlWrapper(fetchContacts));

// GET tek kontak
router.get("/:contactId", authenticate, isValidId, ctrlWrapper(fetchContactById));

// POST kontak oluştur (photo upload destekli)
router.post(
  "/",
  authenticate,
  upload.single('photo'),
  validateBody(contactCreateSchema),
  ctrlWrapper(createContact)
);

// PATCH kontak güncelle (photo upload destekli)
router.patch(
  "/:contactId",
  authenticate,
  isValidId,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContact)
);

// DELETE kontak
router.delete("/:contactId", authenticate, isValidId, ctrlWrapper(deleteContact));

export default router;
