import { Readable } from 'stream';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from '@azure/storage-blob';
import HttpError from '../../helper/httpError';

export const uploadFiles = async function (files, folder) {
  let imageUrls;
  if (files instanceof Array) {
    const promises = [];

    for (const field in files) {
      if (files.hasOwnProperty(field)) {
        const file = files[field];
        promises.push(
          uploadFileToBlob({
            buffer: file.buffer,
            mimeType: file.mimetype,
            name: file.originalname,
          })
        );
      }
    }

    imageUrls = await Promise.all(promises)
      .then((results) => {
        return results;
      })
      .catch((error) => {
        throw error;
      });
  }
  return imageUrls;
};

const uploadFileToBlob = async function ({ buffer, mimeType, name }) {
  const uploadOptions = {
    bufferSize: 4 * 1024 * 1024,
    maxConcurrency: 20,
    blobOptions: { blobHTTPHeaders: { blobContentType: mimeType } },
  };

  const account = process.env.AZURE_STORAGE_ACCOUNT;
  const accountKey = process.env.AZURE_STORAGE_KEY;
  const container = process.env.AZURE_STORAGE_CONTAINER;

  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const stream = Readable.from(buffer);
  const containerClient = blobServiceClient.getContainerClient(container);
  const blockBlobClient = containerClient.getBlockBlobClient(name);

  try {
    await blockBlobClient.uploadStream(
      stream,
      uploadOptions.bufferSize,
      uploadOptions.maxConcurrency,
      uploadOptions.blobOptions
    );
    return `https://${account}.blob.core.windows.net/${container}/${name}`;
  } catch (error) {
    throw new HttpError(
      400,
      error?.message || 'Error uploading file, try again'
    );
  }
};

export const getSignedUrl = async function (filename) {
  const account = process.env.AZURE_STORAGE_ACCOUNT;
  const accountKey = process.env.AZURE_STORAGE_KEY;
  const container = process.env.AZURE_STORAGE_CONTAINER;

  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const containerClient = blobServiceClient.getContainerClient(container);
  const blockBlobClient = containerClient.getBlockBlobClient(filename);

  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 10); // Expires in 10 minutes

  // Generate the SAS token for the container
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: filename,
      expiresOn: expiryDate,
      permissions: BlobSASPermissions.parse('racwd'),
    },
    sharedKeyCredential
  );

  return `${blockBlobClient.url}?${sasToken}`;
};
