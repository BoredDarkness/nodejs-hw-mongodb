import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import { listContacts, getContact } from './controllers/contacts.js';

dotenv.config();

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp());

  app.get('/', (_, res) => {
    res.json({ message: 'API is up and running!' });
  });

  app.get('/contacts', listContacts);
  app.get('/contacts/:contactId', getContact);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}
