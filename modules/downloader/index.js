const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const moment = require('moment');

const destination = path.join(__dirname, '../../files');

if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
}

module.exports = {
    download: (opts) => {
        let filePath = `${ destination }/${ opts.title || moment().format('DDMMYYYY_HHmmss') }.${ opts.format }`;

        if (fs.existsSync(filePath)) {
            let [ newPath ] = filePath.split('.');
            filePath = `${ newPath }_${ moment().format('DDMMYYYY_HHmmss') }.${ opts.format }`;
        }

        return new Promise((resolve, reject) => {
            let file = fs.createWriteStream(filePath);

            if (isSecureProtocol(opts.url)) {
                return https.get(opts.url, res => {
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        return resolve(true);
                    });
                    file.on('error', err => {
                        return reject(err);
                    });
                });
            } else {
                http.get(opts.url, res => {
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        return resolve(true);
                    });
                    file.on('error', err => {
                        return reject(err);
                    });
                });
            }
        });
    }
};

function isSecureProtocol(url) {
    let [ protocol ] = url.split(':');
    return protocol === 'https';
};