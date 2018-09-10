const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment')

connection = mongoose.createConnection('mongodb://localhost:27017/node_cqrs', { useNewUrlParser: true });
autoIncrement.initialize(connection);

const ReportSchema = new Schema({
  report_id: { type: Number },
  report_type: { type: String },
  reporter_email: { type: String },
  is_active: { type: Boolean }
});

ReportSchema.plugin(autoIncrement.plugin, { model: 'report', field: 'report_id' });
const Report = mongoose.model('report', ReportSchema);

module.exports = Report;
