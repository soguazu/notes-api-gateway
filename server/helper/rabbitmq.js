const amqp = require('amqplib');

const CONN_URL = process.env.RABBITMQ_SERVICE;
let ch = null;
// amqp.connect(CONN_URL, function (err, conn) {
//   conn.createChannel(function (err, channel) {
//     ch = channel;
//   });
// });
async function producer() {
  const connection = await amqp.connect(CONN_URL);
  let channel = await connection.createChannel();
  return channel;
}

producer().then((channel) => {
  ch = channel;
});

export const publishToQueue = async (queueName, data) => {
  await ch.assertQueue(queueName, { durable: false });
  await ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
};

process.on('exit', (code) => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});
