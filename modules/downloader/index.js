const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const moment = require('moment');
const request = require('request');
const progress = require('request-progress');
const viewer = require('../viewer');

const destination = path.join(__dirname, '../../files');

if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
}

module.exports = {
    download(job) {
        let opts = job.data;
        let filePath = `${ destination }/${ opts.title || moment().format('DDMMYYYY_HHmmss') }.${ opts.format }`;

        if (fs.existsSync(filePath)) {
            let [ newPath ] = filePath.split('.');
            filePath = `${ newPath }_${ moment().format('DDMMYYYY_HHmmss') }.${ opts.format }`;
        }

        return new Promise((resolve, reject) => {
            let file = fs.createWriteStream(filePath);

            return progress(request(opts.url))
                .on('progress', state => job.progress(state.percent, 1))
                .on('error', err => {
                    file.close();
                    return reject(err);
                })
                .on('end', () => {
                    file.close();
                    return resolve(true);
                })
                .pipe(file);
        });
    }
};
