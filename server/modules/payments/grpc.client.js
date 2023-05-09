import { resolve } from 'path';
require('dotenv').config({
  path: resolve(__dirname, '..', '..', '..', '.env'),
});
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = `${process.env.PROTO_PATH}/subscription/subscription.proto`;

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const paymentProto = grpc.loadPackageDefinition(packageDefinition).subscription;
const client = new paymentProto.PaymentService(
  process.env.SUBSCRIPTION_SERVICE,
  grpc.credentials.createInsecure()
);

export default client;
