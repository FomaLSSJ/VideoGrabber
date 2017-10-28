module.exports = {
    getNameFromUrl: (url) => {
        let [ name ] = url.split('/').pop().split('?');
        return name;
    }
};