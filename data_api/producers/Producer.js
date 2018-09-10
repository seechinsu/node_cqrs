const amqp = require('amqplib/callback_api');

// Set rabbitmq host url string
const rabbitmqHost = 'amqp://user:bitnami@localhost:5672';

module.exports = {
  broadCast(q, msg) {
    amqp.connect(rabbitmqHost, (err,conn) => {
    conn.createChannel((err, ch) => {
      ch.assertQueue(q, {durable: true});
      ch.sendToQueue(q, Buffer.from(msg), {persistent: true})
      console.log(msg);
      });
    });
  }
}
