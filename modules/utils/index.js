const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const viewer = require('../viewer');

const DEBUGERS = [ 181223833 ];
const DESTINATION = path.join(__dirname, '../../files');

const baseUrl = 'https://www.pornhub.com';
const baseReqOpts = { headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
}};

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
    },

    /**
     * Pornohub
     * @param {*} bodyStr 
     */
    findTitle (bodyStr) {
        const $ = cheerio.load(bodyStr);
        const title = $('title').text();
        const arr = title.split('-');
        arr.pop();
      
        return arr.join('-');
    },

    /**
     * Pornohub
     * @param {*} bodyStr 
     */
    parseDownloadInfo(bodyStr) {
        let info;
        const idx = bodyStr.indexOf('mediaDefinitions');

        if (idx < 0) return info;

        let begin, end;
        for (let i = idx; i < bodyStr.length; i++) {
            const tmpStr = bodyStr.substr(i, 1);
            if (tmpStr === '[') begin = i;
            if (tmpStr === ']') {
                end = i;
                break;
            }
        }

        if (begin >=0 && end >= 0) {
            const jsonStr = bodyStr.substring(begin, end + 1);
            let arr = JSON.parse(jsonStr);
            arr = _.filter(arr, item => item.videoUrl.length > 0);
            arr = _.orderBy(arr, 'quality', 'desc');

            if (arr.length > 0) {
                info = arr[0];
                info.title = this.findTitle(bodyStr);
            }
        }

        return info;
    },

    /**
     * Pornohub
     * @param {*} key 
     */
    findDownloadInfo (key) {
        return new Promise((resolve, reject) => {
            let pageUrl = `https://www.pornhub.com/view_video.php?viewkey=${key}`;
            if (key.startsWith('http')) pageUrl = key;
            let opts = { url: pageUrl };

            Object.assign(opts, baseReqOpts);

            request(opts, (err, res, body) => {
                if (err) return reject(err);
                return resolve(this.parseDownloadInfo(body));
            });
        });
    }
};