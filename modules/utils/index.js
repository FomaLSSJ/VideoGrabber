const viewer = require('../viewer');
const DEBUGERS = [181223833];

module.exports = {
    getNameFromUrl: (url) => {
        let [ name ] = url.split('/').pop().split('?');
        return name;
    },

    isAllowed: (id) => {
        return DEBUGERS.includes(id);
    },

    renderVideoList: () => {
        return viewer.generate()
            .then(res => true)
            .catch(err => false);
    }
};