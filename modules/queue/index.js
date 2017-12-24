const kue = require('kue'),
    queue = kue.createQueue(),
    downloader = require('../downloader');

module.exports = {
    Kue: kue,

    create(opts) {
        return new Promise((resolve, reject) => {
            var job = queue.create('download', opts).save(err => {
               if (err) return reject(err);
               return resolve(job.id);
            });
        });
    }
};

queue.process('download', (job, done) => {
    return downloader.download(job)
        .then(data => done())
        .catch(err => done(err));
});