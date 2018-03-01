global._ = require('lodash');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    xvideos = require('../modules/platforms/xvideos');

const TEST_DATA = {
    URL: 'https://www.xvideos.com/video28212669/sophie_crush_webcam_striptease_porn_-_nakedcamgirlzlive.com',
    TITLE: 'sophie_crush_webcam_striptease_porn_-_nakedcamgirlzlive.com',
    REGEXP: /^https:(.*)xvideos-cdn.com(.*).mp4?/g,
    FORMAT: ['mp4', 'm4v', 'flv'],
    PLATFORM: 'XVIDEOS'
};

describe('XVIDEOS Platform', () => {
    it('Request', () => {
        return xvideos.getDetails(TEST_DATA.URL)
            .then(res => {
                const { title, url, platform, format } = res;

                assert.equal(title, TEST_DATA.TITLE);
                assert.match(url, TEST_DATA.REGEXP);
                assert.include(TEST_DATA.FORMAT, format);
                assert.equal(platform, TEST_DATA.PLATFORM);
            });
    });
});
