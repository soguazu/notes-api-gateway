import * as amqp from 'amqplib/callback_api';

const CONN_URL = process.env.RABBITMQ_SERVICE;
let ch = null;
amqp.connect(CONN_URL, function (err, conn) {
  conn.createChannel(function (err, channel) {
    ch = channel;
  });
});
export const publishToQueue = async (queueName, data) => {
  await ch.assertQueue(queueName, { durable: false });
  await ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
};

process.on('exit', (code) => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});
