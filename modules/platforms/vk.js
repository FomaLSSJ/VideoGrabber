const utils = require('../utils');
const VKApi = require('node-vkapi');
const rp = require('request-promise');
const vk = new VKApi();

vk.authorize({
    client:   process.env.VK_CLIENT,
    login:    process.env.VK_LOGIN,
    password: process.env.VK_PASS
})
.then(res => console.log(`[vkapi] auth ${ res.user_id }`))
.catch(err => console.log(`[error] vkapi ${ err }`));

module.exports = {
	getDetails: (url) => {
        let videoId = url.split('/').pop().split('o').pop();

        return vk.call('video.get', { videos: videoId })
            .then(res => {
                if (!res.items.length) {
                    return Promise.reject('Count 0');
                }

                let [ item ] = res.items,
                    { id, files } = item,
                    { file, format } = findBestVideo(files);

                return { title: id, url: file, platform: 'VK', format: format };
            })
            .catch(err => console.error(err));
	}
};

function findBestVideo(files) {
    let format = 'mp4',
        max = 0;

    for (file in files) {
        let [ newFormat, newMax ] = file.split('_');
        if (_.isEmpty(newMax)) {
            continue;
        }

        newMax = parseInt(newMax);

        if (newMax > max) {
            format = newFormat;
            max = newMax;
        }
    }

    return { file: files[`${ format }_${ max }`], format: format };
}