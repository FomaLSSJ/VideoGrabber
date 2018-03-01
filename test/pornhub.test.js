global._ = require('lodash');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    pornhub = require('../modules/platforms/pornhub');

const TEST_DATA = {
    URL: 'https://www.pornhub.com/view_video.php?viewkey=94339200',
    TITLE: 'Hottest Strip Video ',
    REGEXP: /^https:(.*)phncdn.com(.*).mp4?/g,
    FORMAT: ['mp4', 'm4v', 'flv'],
    PLATFORM: 'Pornhub'
};

describe('Pornohub Platform', () => {
    it('Request', () => {
        return pornhub.getDetails(TEST_DATA.URL)
            .then(res => {
                const { title, url, platform, format } = res;

                assert.equal(title, TEST_DATA.TITLE);
                assert.match(url, TEST_DATA.REGEXP);
                assert.include(TEST_DATA.FORMAT, format);
                assert.equal(platform, TEST_DATA.PLATFORM);
            });
    });
});
