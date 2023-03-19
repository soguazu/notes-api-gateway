const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
import path from 'path';

const PROTO_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '/notes-protos-nodejs/user/user.proto'
);

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;
const client = new userProto.UserService(
  'localhost:30001',
  grpc.credentials.createInsecure()
);

export default client;
