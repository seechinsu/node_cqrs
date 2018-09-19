const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const amqp = require('amqplib/callback_api');

mongoose.connect('mongodb://localhost:27017/node_cqrs', { useNewUrlParser: true });

// connection = mongoose.createConnection('mongodb://localhost:27017/node_cqrs', { useNewUrlParser: true });
// autoIncrement.initialize(connection);

const ReportedEntitySchema = new Schema({
  report_id: Schema.Types.ObjectId,
  report_type: { type: String },
  reporter_email: { type: String },
  is_active: { type: Boolean },
  entity_id: { type: Number },
  entity_type: { type: String },
  entity_subtype: { type: String }
});

// ReportedEntitySchema.plugin(autoIncrement.plugin, { model: 'reported_entities', field: 'entity_id' });
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
      let payload = JSON.parse(message)

      payload.report_id = payload._id;

      delete payload._id;

      const entities = payload.entities;

      delete payload.entities;

      const reportData = payload;

      // console.log("-----------------------");
      // console.log(entities);
      // console.log(reportData);
      // console.log("-----------------------");
      const list_payload = entities.map(function (obj) {
        return Object.assign(obj,reportData);
      })
      console.log(list_payload);
      console.log("-----------------------");

      // Parse message to json and insert into mongodb
      // const reports = new Entity(payload);
      // console.log(report);
      Entity.insertMany(list_payload)
        .then((savedReports) => {
          console.log(savedReports);
        })
        .catch((err) => {
          console.log(err);
        });

      // Requires acknowledgement from rabbit
      ch.ack(msg);
    }, {noAck: false});
  });
});
