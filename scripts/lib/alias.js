'use strict';

const pagination = require('hexo-pagination');

module.exports = function(locals) {
    const config = this.config;

    return Object.keys(config.alias).reduce((acc,path) => {
        const data = pagination(path, [{}], {
            layout: ["alias"],
            data: config.alias[path]
        });
        return acc.concat(data);
    }, [])
};
