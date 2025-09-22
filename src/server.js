import express from "express";
import cors from "cors";
import pino from "pino-http";
import { env } from "./utils/env.js";
import contactsRouter from "./routers/contacts.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.use("/contacts", contactsRouter);

  // Not found middleware
  app.use(notFoundHandler);

  // Error handler middleware
  app.use(errorHandler);

  const PORT = env("PORT", false) || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });

  return app;
};
