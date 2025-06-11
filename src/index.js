import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

initMongoConnection()
  .then(() => {
    setupServer();
  })
  .catch((err) => {
    console.error('Failed to initialize MongoDB:', err);
    process.exit(1);
  });
