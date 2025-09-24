import fs from 'node:fs';
import path from 'node:path';
import  Contact  from '../models/contact.js'; // model
import mongoose from 'mongoose';
import { env } from '../utils/env.js';

const contactsFilePath = path.join(process.cwd(), 'src', 'db', 'contacts.json');

const initMongo = async () => {
  const user = env('MONGODB_USER');
  const pwd = env('MONGODB_PASSWORD');
  const url = env('MONGODB_URL');
  const db = env('MONGODB_DB');

  await mongoose.connect(
    `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`
  );
  console.log('MongoDB connected');
};
export const initMongoConnection = initMongo;

//contact.json dosyasındaki verileri MongoDB'ye import et
/*const importContacts = async () => {
  try {
    await initMongo();

    const data = fs.readFileSync(contactsFilePath, 'utf-8');
    const contacts = JSON.parse(data);

    const result = await Contact.insertMany(contacts);
    console.log(`✅ ${result.length} contacts imported successfully!`);

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error importing contacts:', err.message);
  }
};

importContacts();
*/