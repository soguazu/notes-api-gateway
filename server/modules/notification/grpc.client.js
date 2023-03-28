const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
import path from 'path';

const PROTO_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '/notes-protos-nodejs/notification/notification.proto'
);

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const notificationProto = grpc.loadPackageDefinition(packageDefinition).notification;
const client = new notificationProto.NotificationService(
  '0.0.0.0:30002',
  grpc.credentials.createInsecure()
);

export default client;
