const fs = require('fs');
const path = require('path');

const PATH = path.join(__dirname, '../../files');

let index = fs.createWriteStream(path.join(PATH, 'index.html'));

module.exports = {
    generate: () => {
        return new Promise((resolve, reject) => {
            let dir = fs.readdirSync(PATH);

            writeHeader();
            writeContent(dir);
            writeFooter();

            index.end();

            return resolve(true);
        });
    }
};

function writeHeader() {
    index.write('<html><head><title>Files</title></head><body>');
}

function writeContent(files) {
    files.forEach((x, i) => {
        index.write(`<a href="/files/${ x }">${ i + 1 } - ${ x }</a></br>`);
    });
}

function writeFooter() {
    index.write('</body></html>');
}