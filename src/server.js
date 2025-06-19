import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';

import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(pinoHttp());

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  return app;
}
