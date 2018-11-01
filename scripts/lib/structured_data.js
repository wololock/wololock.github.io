'use strict';

module.exports = structured_data;

var util = require('hexo-util');

function structured_data(page, config) {
    var data = {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': config.url + '/' + page.path
        },
        'headline': page.title
    };

    if (page.og_image !== undefined) {
        data['image'] = {
            '@type': 'ImageObject',
            'url': config.url + page.og_image
        }
    }

    data['datePublished'] =  page.date;
    data['dateModified'] = page.updated;
    data['author'] = {
        '@type': 'Person',
        'name': config.author
    };
    data['publisher'] = {
        '@type': 'Organization',
        'name': config.title,
        'logo': {
            '@type': 'ImageObject',
            'url': config.url + '/images/site-logo.jpg',
            'height': 60,
            'width': 600
        }
    };
    data['description'] = util.stripHTML(page.excerpt);
    if (page.tags !== undefined) {
        data['keywords'] = page.tags.map(function(tag) { return tag.name }).join(',');
    }

    return '<script type="application/ld+json">' + JSON.stringify(data) + '</script>';
}