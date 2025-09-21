import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { fetchContacts, fetchContactById } from './controllers/contactsControllers.js';

export const setupServer = () => {
  const app = express();

  app.use(cors()); // Farklı domainlerden gelen istekleri açıyor
  app.use(pino()); // HTTP request’leri log’lamak için kullanılıyor

  // rotalar **404 middleware’den önce** eklenmeli
  app.get('/contacts', fetchContacts);
  app.get('/contacts/:contactId', fetchContactById);
  
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = env('PORT', false) || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });

  return app; // app’i döndür
};
