const ReportsController = require('../controller/reports_controller')

module.exports = (app, router) => {
  // Watch for incoming requests of method GET
  // to the route http://localhost:3050/greeting

  app.use(router);

  router.route('/report/greeting')
    .get(ReportsController.greeting);

  router.route('/api/reports')
    .post(ReportsController.create)
    .get(ReportsController.index);

  router.route('/api/reports/:id')
    .get(ReportsController.readReportId)
    .put(ReportsController.editReportId)
    .delete(ReportsController.deleteReportId);

  router.route('/api/reports/doc/:id')
    .get(ReportsController.readDocId)
    .put(ReportsController.editDocId)
    .delete(ReportsController.deleteDocId);
};
