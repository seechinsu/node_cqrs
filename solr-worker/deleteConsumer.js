const amqp = require('amqplib/callback_api');
const solrNode = require('nolr');

// Sets solr client
const client = new solrNode({
    host: 'localhost',
    port: '8983',
    protocol: 'http',
    debugLevel: 'ERROR'
});

// Make connection to rabbitmq
amqp.connect('amqp://user:bitnami@localhost:5672', function(err,conn) {
  // Open up a message queue channel
  conn.createChannel(function(err,ch) {

    //assign queue to listen to
    const q = 'delete_task';
    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    console.log("Listening for messages...");

    // Consumes any messages in queue
    ch.consume(q, function(msg) {
      const message = msg.content;
      console.log(`Received message: ${message}`);

      // Parse message to json and index into solr
      client.options.core = 'ciera'
      const payload = JSON.parse(message);

      const reportId = payload.report_id;
      const query = `report_id:${reportId}`;

      client.delete(query, function(err, result) {
       if (err) {
          console.log(err);
          return;
       }
       // Console log respone by solr
       console.log('solrResponse:', result.responseHeader);
      });

      // Requires acknowledgement from rabbit
      ch.ack(msg);
    }, {noAck: false});
  });
});
