const Report = require('../models/report');
const Producer = require('../producers/Producer');

module.exports =  {

  // Just a test greeting to see that the service is responding
  greeting(req, res, next) {
      res.send({ hi: 'there'});
  },

  // Returns a list of objects depending on parameters
  index(req, res, next) {
    // How many objects to skip, default 0
    const offset = parseInt(req.query.offset) || 0;
    // How many objects to return, default 25
    const limit = parseInt(req.query.limit) || 25;
    // Which field to sort by, default is ascending order
    const sortProperty = req.query.sortProperty;

    // Queries mongodb using mongoose models method
    Report.find({})
      .sort({ [sortProperty]: 1})
      .skip(offset)
      .limit(limit)
      .then((reports) => res.send(reports))
      .catch(next);
  },

  // Finds an object in the mongodb collection by object Id
  readDocId(req, res, next) {
    const docId = req.params.id;
    Report.findById(docId)
      .then((report) => res.send(report))
      .catch(next);
  },

  // Finds an object in the mongodb collection by object Id
  readReportId(req, res, next) {
    const reportId = req.params.id;
    Report.findOne({report_id: reportId})
      .then((report) => res.send(report))
      .catch(next);

  },

  // Creates a new object in the mongodb collection
  create(req, res, next) {
    // Parse request body

    req.body.reporter.entity_type = 'person';
    req.body.reporter.entity_subtype = 'reporter';
    const reportProps = req.body;
    //const reporter = req.body.reporter;
    //console.log(reporter);

    // Create new document instance
    const report = new Report(reportProps);

    //console.log(report);
    // First save the new report based on the request body
    report.save()
      .then((savedReport) => {
        res.status(201).send(savedReport);
        // Send message with entire object to rabbitmq
        const q = 'create_task';
        const msg = JSON.stringify(savedReport);
        Producer.broadCast(q,msg);
      })
      .catch(next);
  },

  // Attempts to edit existing object by providing new properties and object Id
  editDocId(req, res, next) {
      // Parse request paramenters and body
      const docId = req.params.id;
      const reportProps = req.body;

      // Find object by Id and update
      Report.findByIdAndUpdate(docId, reportProps)
        .then(() => Report.findById(docId))
        .then((editedReport) => {
          res.send(editedReport);
          // Send message with entire object to rabbitmq after oject is updated
          const q = 'update_task';
          const msg = JSON.stringify(editedReport);
          Producer.broadCast(q,msg);
        })
        .catch(next);
  },

  // Attempts to edit existing object by providing new properties and object Id
  editReportId(req, res, next) {
      // Parse request paramenters and body
      const reportId = req.params.id;
      const reportProps = req.body;

      // Find object by Id and update
      Report.findOneAndUpdate({report_id: reportId}, reportProps)
        .then(() => Report.findOne({report_id: reportId}))
        .then((editedReport) => {
          res.send(editedReport);
          // Send message with entire object to rabbitmq after oject is updated
          const q = 'update_task';
          const msg = JSON.stringify(editedReport);
          Producer.broadCast(q,msg);
        })
        .catch(next);
  },

  // Attempts to delete object in a collection by Object Id
  deleteDocId(req, res, next) {
      // Parse Id from request
      const docId = req.params.id;

      // Remove object from mongodb collection by Id
      Report.findByIdAndRemove(docId)
        .then((deletedReport) => {
          res.send(deletedReport);
          // Send message to rabbitmq with only the id of the object
          const q = 'delete_task';
          const msg = JSON.stringify(deletedReport);
          Producer.broadCast(q,msg);
        })
        .catch(next);
  },

  // Attempts to delete object in a collection by Report Id
  deleteReportId(req, res, next) {
      // Parse Id from request
      const reportId = req.params.id;

      // Remove object from mongodb collection by Id
      Report.findOneAndRemove({report_id: reportId})
        .then((deletedReport) => {
          res.send(deletedReport);

          // Send message to rabbitmq with only the id of the object
          const q = 'delete_task';
          const msg = JSON.stringify(deletedReport);
          Producer.broadCast(q,msg);
        })
        .catch(next);
  }
};
