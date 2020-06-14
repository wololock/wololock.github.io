'use strict'

const asciidoctor = require('asciidoctor')();

const opts = {
    safe: 'safe',
    attributes: {
        doctype: 'article',
        showtitle: false,
        icons: 'font',
        idprefix: '',
        idseparator: '-',
        sectids: true,
        'source-highlighter': 'highlightjs',
        'listing-caption': 'Listing',
        linkattrs: true
    }
};

function render(data) {
    return asciidoctor.convert(data.text, opts);
}

module.exports = render;