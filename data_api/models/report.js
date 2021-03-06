const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment')

connection = mongoose.createConnection('mongodb://localhost:27017/node_cqrs', { useNewUrlParser: true });
autoIncrement.initialize(connection);

const ReportedEntities = {
  entity_id: { type: Number },
  entity_type: { type: String },
  entity_subtype: { type: String },
  first_name: { type: String }
};

const ReportSchema = new Schema({
  report_id: { type: Number },
  report_type: { type: String },
  reporter_email: { type: String },
  is_active: { type: Boolean },
  entities: [ReportedEntities]
});

ReportSchema.plugin(autoIncrement.plugin, { model: 'report', field: 'report_id' });
const Report = mongoose.model('report', ReportSchema);

module.exports = Report;
