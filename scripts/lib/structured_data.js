'use strict';

module.exports = structured_data;

var util = require('hexo-util');

function structured_data(page, config) {

    const person_id = config.url + '/#/schema/person/wololock';
    const website_id = config.url + '/#website';
    const webpage_id = config.url + '/' + page.path + '#webpage';
    const article_id = config.url + '/' + page.path + '#article';
    const category = page.categories.toArray()[0];

    const data = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': ['Person', 'Organization'],
                '@id': person_id,
                'name': config.author,
                'description': config.bio,
                'image': {
                    '@type': 'ImageObject',
                    '@id': config.url + '/#avatar',
                    'inLanguage': 'en-US',
                    'url': config.photo,
                    'caption': config.author
                },
                'logo': {
                    '@id': config.url + '/#avatar'
                },
                'sameAs': [
                    'https://twitter.com/wololock',
                    'https://github.com/wololock',
                    'https://stackoverflow.com/users/2194470/szymon-stepniak',
                    'https://www.youtube.com/c/eprintstacktrace'
                ]
            },
            {
                '@type': 'WebSite',
                '@id': website_id,
                'url': config.url,
                'name': config.title,
                'description': config.description
            },
            {
                '@type': 'WebPage',
                '@id': webpage_id,
                'url': config.url + '/' + page.path,
                'name': page.title,
                'isPartOf': {
                    '@id': website_id
                },
                'datePublished': page.date,
                'dateModified': page.updated,
                'description': util.stripHTML(page.excerpt),
                'inLanguage': 'en-US',
                'potentialAction': [
                    {
                        '@type': 'ReadAction',
                        'target': [
                            config.url + '/' + page.path
                        ]
                    }
                ]
            },
            {
                '@type': 'Article',
                '@id': article_id,
                'isPartOf': {
                    '@id': webpage_id
                },
                'author': {
                    '@id': person_id
                },
                'headline': page.title,
                'datePublished': page.date,
                'dateModified': page.updated,
                'mainEntityOfPage': {
                    '@id': webpage_id
                },
                'publisher': {
                    '@id': person_id
                },
                'keywords': page.tags.map(tag => tag.name).join(','),
                'image': {
                    '@type': 'ImageObject',
                    '@id': config.url + '/' + page.path + '#primaryimage',
                    'url': config.url + page.og_image,
                    'inLanguage': 'en-US',
                    'caption': page.title
                },
                'inLanguage': 'en-US'
            },
            {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'item': {
                            '@id': config.url,
                            'name': 'Home'
                        }
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'item': {
                            '@id': category.permalink,
                            'name': category.name
                        }
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'item': {
                            '@id': config.url + '/' + page.path,
                            'name': page.title
                        }
                    }
                ]
            }
        ]
    };

    if  (page.structured_data !== undefined) {
        data['@graph'].push(page.structured_data);
    }

    return '<script type="application/ld+json">' + JSON.stringify(data) + '</script>';
}




























