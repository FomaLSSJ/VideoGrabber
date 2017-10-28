const utils = require('../utils');
const rp = require('request-promise');

module.exports = {
	getDetails: (url) => {
		const opts = { method: 'GET', uri: url };

		return rp(opts)
			.then(data => {
				let name = utils.getNameFromUrl(url);

				let line = data.match(/(file)(.*)(\/cdn)(.*)(\'\,)/g);
				let linem = data.match(/(")(https?:\/\/cdn)(.*)(")( )/g);

				let elements = line
					? line[0].split('\'')
					: linem[0].split('"');

				return { title: name, url: elements[1].replace(/&amp;/g, '&'), platform: 'EroProfile', format: 'm4v' };
			})
			.catch(err => console.error(err));
	}
};