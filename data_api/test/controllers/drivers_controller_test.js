// const mongoose = require('mongoose');
// const assert = require('assert');
// const request = require('supertest');
// const app = require('../../app');
//
// const Driver = mongoose.model('report');
//
// describe('Drivers Controller', () => {
//
//   it('POST to /api/drivers creates a new driver', (done) => {
//     Driver.count().then(count => {
//       request(app)
//         .post('/api/drivers')
//         .send({ email: 'test@test.com' })
//         .end(() => {
//           Driver.count().then( newCount => {
//             assert(count+1 === newCount);
//             done();
//           });
//         });
//     });
//   });
//
//   it('PUT to /api/drivers/id edits an existing driver', (done) => {
//     const driver = new Driver({ email: 't@t.com', driving: false });
//     driver.save()
//       .then(() => {
//         request(app)
//           .put(`/api/drivers/${driver._id}`)
//           .send({ driving: true })
//           .end(() => {
//             Driver.findById(driver._id)
//               .then(driver => {
//                 assert(driver.driving === true);
//                 done();
//               });
//           });
//       });
//   });
//
//   it('DELETE to /api/drivers/id deletes an existing driver', (done) => {
//     const driver = new Driver({ email: 'delete@me.com'});
//     driver.save()
//       .then(() => {
//         request(app)
//           .delete(`/api/drivers/${driver._id}`)
//           .end(() => {
//             Driver.findById(driver._id)
//               .then(driver => {
//                 assert(driver === null);
//                 done();
//               });
//           });
//       });
//   });
//
//   it('GET to /api/drivers find a Driver by Id', (done) => {
//     const findMeDriver = new Driver({ email: 'findMe@test.com' });
//
//     findMeDriver.save()
//       .then(() => {
//         request(app)
//           .get(`/api/drivers/${findMeDriver._id}`)
//           .end(() => {
//             Driver.findById(findMeDriver._id)
//               .then((driver) => {
//                 assert(driver._id.toString() === findMeDriver._id.toString());
//                 done();
//               });
//           });
//       });
//   });
// });
