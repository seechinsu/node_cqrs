const mongoose = require('mongoose');

before((done) => {
  mongoose.connect('mongodb://localhost:27017/node_cqrs_test', { useNewUrlParser: true });
  mongoose.connection
    .once('open', () => { done(); })
    .on('error', (error) => {
      console.warn('Warning', error);
    });
});
