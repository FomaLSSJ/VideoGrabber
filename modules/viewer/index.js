const fs = require('fs');
const path = require('path');

const PATH = path.join(__dirname, '../../files');

let template = fs.readFileSync(path.join(__dirname, 'templates/files.html'), 'utf8');

module.exports = {
    generate() {
        return new Promise((resolve, reject) => {
            try {
                let videos = fs.readdirSync(PATH);
                _.remove(videos, x => x === 'index.html')
                let render = _.template(template)({ title: 'Video Files', videos: videos });
                let file = fs.createWriteStream(path.join(PATH, 'index.html'));
                file.write(render);
                file.end();
                return resolve(render);
            } catch (err) {
                console.log(`[error] viewer ${ err }`);
                return reject(err);
            }
        });
    }
};
