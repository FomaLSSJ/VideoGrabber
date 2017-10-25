const logger = require('morgan'),
    kue = require('./modules/queue').Kue;
    app = kue.app;

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

module.exports = app;