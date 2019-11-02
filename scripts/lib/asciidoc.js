'use strict'

const asciidoctor = require('asciidoctor.js')();
const path = require('path');

const opts = {
    safe: 'safe',
    attributes: {
        doctype: 'article',
        showtitle: false,
        icons: 'font',
        idprefix: '',
        idseparator: '-',
        sectids: true,
        'source-highlighter': 'highlight.js',
        'listing-caption': 'Listing'
    }
};

function render(data) {
    // if (data.path) {
    //     const entry = path.parse(data.path);
    //     const assetDir = path.join(entry.dir, entry.name);
    //     opts.attributes.docdir = assetDir;
    // }

    return asciidoctor.convert(data.text, opts);
}

module.exports = render;