global._ = require('lodash');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    eroprofile = require('../modules/platforms/eroprofile');

const TEST_DATA = {
    URL: 'http://www.eroprofile.com/m/videos/view/Small-Sexy-Teen-Dance-Play-with-Pussy',
    TITLE: 'Small-Sexy-Teen-Dance-Play-with-Pussy',
    REGEXP: /^http:(.*)cdn.videos.eroprofile.com(.*).m4v?/g,
    FORMAT: ['mp4', 'm4v', 'flv'],
    PLATFORM: 'EroProfile'
};

describe('EroProfile Platform', () => {
    it('Request', () => {
        return eroprofile.getDetails(TEST_DATA.URL)
            .then(res => {
                const { title, url, platform, format } = res;

                assert.equal(title, TEST_DATA.TITLE);
                assert.match(url, TEST_DATA.REGEXP);
                assert.include(TEST_DATA.FORMAT, format);
                assert.equal(platform, TEST_DATA.PLATFORM);
            });
    });
});
