const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment')
const amqp = require('amqplib/callback_api');

mongoose.connect('mongodb://localhost:27017/node_cqrs', { useNewUrlParser: true });

connection = mongoose.createConnection('mongodb://localhost:27017/node_cqrs', { useNewUrlParser: true });
autoIncrement.initialize(connection);

const ReportedEntitySchema = new Schema({
  report_id: { type: Number },
  report_type: { type: String },
  reporter_email: { type: String },
  is_active: { type: Boolean },
  entity_id: { type: Number },
  entity_type: { type: String },
  entity_subtype: { type: String }
});

ReportedEntitySchema.plugin(autoIncrement.plugin, { model: 'reported_entities', field: 'entity_id' });
const Entity = mongoose.model('reported_entities', ReportedEntitySchema);

amqp.connect('amqp://user:bitnami@localhost:5672', function(err,conn) {
  // Open up a message queue channel
  conn.createChannel(function(err,ch) {

    //assign queue to listen to
    const q = 'insert_mongo_task';
    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    console.log("Listening for messages...");

    // Consumes any messages in queue
    ch.consume(q, function(msg) {
      const message = msg.content;
      console.log(`Received message: ${message}`);
      const payload = JSON.parse(message)

      const entities = payload.entities;

      delete payload.entities;

      const reportData = payload;

      let list = [1,2,3]

      console.log(list.forEach((value) => {value*2}));

      console.log("-----------------------");
      console.log(entities);
      console.log(reportData);
      console.log("-----------------------");
      console.log(list.forEach((obj) => { obj *2 }));
      console.log(entities.forEach((obj) => {Object.assign(obj,reportData)}));
      console.log("-----------------------");

      // Parse message to json and insert into mongodb
      const report = new Entity(payload);
      // console.log(report);
      report.save()
        .then((savedReport) => {
            console.log(savedReport);
          }, (err) => {
            console.log(error);
          })

      // Requires acknowledgement from rabbit
      ch.ack(msg);
    }, {noAck: false});
  });
});
