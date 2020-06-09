'use strict'

const asciidoc = require('./lib/asciidoc.js')

hexo.extend.renderer.register('ad', 'html', asciidoc, true)
hexo.extend.renderer.register('adoc', 'html', asciidoc, true)
hexo.extend.renderer.register('asciidoc', 'html', asciidoc, true)

hexo.extend.generator.register('alias', require('./lib/alias'));

hexo.extend.helper.register('structured_data', require('./lib/structured_data.js'));
hexo.extend.tag.register('book', require('./lib/get_the_book.js'));

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
