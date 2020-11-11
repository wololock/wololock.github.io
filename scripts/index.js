'use strict'

const asciidoc = require('./lib/asciidoc.js')
const fs = require('fs');
const path = require('path');

hexo.extend.renderer.register('ad', 'html', asciidoc, true)
hexo.extend.renderer.register('adoc', 'html', asciidoc, true)
hexo.extend.renderer.register('asciidoc', 'html', asciidoc, true)

hexo.extend.generator.register('alias', require('./lib/alias'));

hexo.extend.helper.register('structured_data', require('./lib/structured_data.js'));

hexo.extend.tag.register('book', function(id) {
    if (id.length === 0) {
        return ""
    }
    const book = this.site.data._books[id[0]] || {};
    if (book === undefined) return "";

    book.ld_json = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": book.title,
        "image": hexo.config.url + book.cover,
        "author": {
            "@type": "Person",
            "name": book.author
        },
        "datePublished": book.datePublished,
        "publisher": {
            "@type": "Organization",
            "name": book.publisher,
        },
        "inLanguage": book.inLanguage,
        "isbn": book.isbn,
        "review": {
            "@type": "Review",
            "author": {
                "@id": "https://e.printstacktrace.blog/#/schema/person/wololock",
            },
            "datePublished": book.review.datePublished,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": book.review.rating,
            },
            "reviewBody": book.review.body
        }
    }

    const template = fs.readFileSync(path.resolve(__dirname, '../templates/book.pug'), 'utf-8');
    return hexo.render.renderSync({ text: template, engine: "pug"}, book);
});
hexo.extend.tag.register('newsletter', function(args, content) {
    const newsletter = this.site.data.convertkit[this.newsletter] || {};
    if (newsletter === undefined) return "";
    const template = fs.readFileSync(path.resolve(__dirname, '../templates/newsletter.pug'), 'utf-8');
    return hexo.render.renderSync({ text: template, engine: "pug" }, { newsletter: newsletter, convertkit: content });
}, true);
hexo.extend.tag.register('youtube_card', function(id) {
    const template = fs.readFileSync(path.resolve(__dirname, '../templates/youtube_card.pug'), 'utf-8');
    return hexo.render.renderSync({ text: template, engine: "pug"}, { video: this.site.data.youtube[id], id: id });
});


Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    if ( i == 0 ) return this;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
};

hexo.extend.helper.register("paginated_url", paginated_url);

function paginated_url(path, pagedir, page) {
    let basePath = path.replace("index.html", "");

    const pageIdx = basePath.indexOf(pagedir);

    if (pageIdx >= 0) {
        basePath = basePath.substring(0, pageIdx);
    }

    if (page > 1) {
        return basePath + "/" + pagedir + "/" + page;
    }

    return basePath;
}

const chunk = (input, size) => {
    return input.reduce((arr, item, idx) => {
        return idx % size === 0
            ? [...arr, [item]]
            : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
    }, []);
};

hexo.extend.helper.register("chunk", chunk);