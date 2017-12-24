const utils = require('../utils');
const rp = require('request-promise');

module.exports = {
	getDetails(url) {
		const opts = { method: 'GET', uri: url };

		return rp(opts)
			.then(data => {
				let name = utils.getNameFromUrl(url);

				let line = data.match(/(html5player.setVideoUrlHigh)..(.*).../g);
				let elements = line[0].split('\'');

				return { title: name, url: elements[1], platform: 'XVIDEOS', format: 'mp4' };
			})
			.catch(err => console.error(err));
	}
};