require('dotenv').config();

global._ = require('lodash');

let vk;

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert;

const TEST_DATA = {
    URL: 'https://vk.com/video267478021_170261288',
    TITLE: '170261288',
    REGEXP: /^https:(.*)vkuservideo.net(.*).mp4?/g,
    FORMAT: ['mp4', 'm4v', 'flv'],
    PLATFORM: 'VK'
};

describe('VK Platform', () => {
    before(() => {
        vk = require('../modules/platforms/vk');

        setTimeout(() => true, 2000);
    });

    it('Request', () => {
        const { VK_CLIENT, VK_LOGIN, VK_PASS } = process.env;

        if (!VK_CLIENT || !VK_LOGIN || !VK_PASS) throw new Error('Not given VK data');

        return vk.getDetails(TEST_DATA.URL)
            .then(res => {
                const { title, url, platform, format } = res;

                assert.equal(title, TEST_DATA.TITLE);
                assert.match(url, TEST_DATA.REGEXP);
                assert.include(TEST_DATA.FORMAT, format);
                assert.equal(platform, TEST_DATA.PLATFORM);
            });
    });
});
