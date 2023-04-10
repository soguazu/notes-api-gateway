import * as path from 'path';
import { randomUUID } from 'crypto';
export const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (
    ext !== '.png' &&
    ext !== '.jpg' &&
    ext !== '.gif' &&
    ext !== '.jpeg' &&
    ext !== '.pdf' &&
    ext !== '.xlsx' &&
    ext !== '.docx' &&
    ext !== '.csv' &&
    ext !== '.svg'
  ) {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};
