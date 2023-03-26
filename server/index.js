import path from 'path';
require('dotenv').config({
  path: process.env.ENV_PATH || path.resolve(__dirname, '..', '.env'),
});

import express, { json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/v1';
// import { logger } from './helper';
import HttpError from './helper/httpError';

const PORT = Number(process.env.PORT) || 30000;
const app = express();

// run cron job

app.use(cors());
// CORS pre-flight
app.options('*', cors());

app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true }));

// if (process.env.NODE_ENV !== 'test') {
//   app.use(morgan('combined', { stream: logger.stream }));
// }

// Remove some header info
app.disable('x-powered-by');

// Handle Errors
app.use((err, req, res, next) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  if (err.name === 'HttpError') {
    return err.getErrorResponse(res);
  }

  res.status(500).json({ success: false, error: 'An error occurred' });

  next();
});

app.get('/', (request, response) => {
  response.status(200).send('Welcome to Cocoons Letters Limited');
});

router(app, '/v1/');

app.use('*', (request, response) => {
  response.status(404).send({ success: false, error: 'Path not found' });
});

app.listen(PORT, () => console.info(`Server started on port ${PORT}`));

export default app;
