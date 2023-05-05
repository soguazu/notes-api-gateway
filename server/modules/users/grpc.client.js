import { resolve } from 'path';
require('dotenv').config({
  path: resolve(__dirname, '..', '..', '..', '.env'),
});
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = `${process.env.PROTO_PATH}/user/user.proto`;

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;
const client = new userProto.UserService(
  process.env.USER_SERVICE,
  grpc.credentials.createInsecure()
);

export default client;
