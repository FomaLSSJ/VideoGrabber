const fs = require('fs');
const path = require('path');
const viewer = require('../viewer');

const DEBUGERS = [ 181223833 ];
const DESTINATION = path.join(__dirname, '../../files');

module.exports = {
    getNameFromUrl(url) {
        let [ name ] = url.split('/').pop().split('?');
        return name;
    },

    isAllowed(id) {
        return DEBUGERS.includes(id);
    },

    renderVideoList() {
        return viewer.generate()
            .then(res => true)
            .catch(err => false);
    },

    cleanFiles() {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(DESTINATION)) {
                let files = fs.readdirSync(DESTINATION);
    
                _.each(files, (file, index) => {
                    let filePath = path.join(DESTINATION, file);
                    let fileInfo = fs.statSync(filePath);
                    if (!fileInfo.size) fs.unlinkSync(filePath);
                });
    
                return resolve(true);
            }

            return reject(false);
        });
    }
};