const fs = require('fs');
const path = require('path');

const PATH = path.join(__dirname, '../../files');

let template = fs.readFileSync(path.join(__dirname, 'templates/files.html'), 'utf8');
let index = fs.createWriteStream(path.join(PATH, 'index.html'));

module.exports = {
    generate: () => {
        return new Promise((resolve, reject) => {
            try {
                let videos = fs.readdirSync(PATH);
                _.remove(videos, x => x === 'index.html')
                index.write(_.template(template)({ title: 'Video Files', videos: videos }));
                index.end();
                return resolve(true);
            } catch (err) {
                return reject(err);
            }
        });
    }
};
