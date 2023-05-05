import { resolve } from 'path';
require('dotenv').config({
  path: resolve(__dirname, '..', '..', '..', '.env'),
});
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = `${process.env.PROTO_PATH}/notification/notification.proto`;

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const notificationProto =
  grpc.loadPackageDefinition(packageDefinition).notification;
const client = new notificationProto.NotificationService(
  process.env.NOTIFICATION_SERVICE,
  grpc.credentials.createInsecure()
);

export default client;
