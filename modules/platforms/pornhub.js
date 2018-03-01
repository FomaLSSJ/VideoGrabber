const utils = require('../utils');
const rp = require('request-promise');

module.exports = {
	getDetails(url) {
        return utils.findDownloadInfo(url)
            .then(({ title, videoUrl }) => {
                return { title: title, url: videoUrl, platform: 'Pornhub', format: 'mp4' };
            })
            .catch(err => console.error(err));
	}
};