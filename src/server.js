import express from "express";
import cors from "cors";
import pino from "pino-http";
import { env } from "./utils/env.js";
import contactsRouter from "./routers/contacts.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRouter from "./routers/auth.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());


  app.use("/contacts", contactsRouter);
  app.use("/auth", authRouter);


  const swaggerDocument = YAML.load(path.resolve("docs/openapi.yaml"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

 
  app.use(notFoundHandler);


  app.use(errorHandler);

  const PORT = env("PORT", false) || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📖 Swagger docs available at http://localhost:${PORT}/api-docs`);
  });

  return app;
};
