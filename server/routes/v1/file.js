'use strict';
import express from 'express';
import multer from 'multer';

import { validateAdminToken } from '../middlewares';
import { uploadFile, getSignedUrl } from '../../modules/files/delivery/http';
import { fileFilter } from '../../helper/file';
const inMemoryStorage = multer.memoryStorage();

var upload = multer({
  // dest: '/tmp',
  storage: inMemoryStorage,
  limits: { fileSize: 100 * 1000 * 1000 }, // 100MB max file size
  fileFilter,
});

const router = express.Router();

router.use(['/files'], validateAdminToken);

router.post('/files', upload.array('files'), uploadFile);
router.get('/files/get-signed-url', getSignedUrl);

export default router;
