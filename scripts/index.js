'use strict'

const asciidoc = require('./lib/asciidoc.js')

hexo.extend.renderer.register('ad', 'html', asciidoc, true)
hexo.extend.renderer.register('adoc', 'html', asciidoc, true)
hexo.extend.renderer.register('asciidoc', 'html', asciidoc, true)

hexo.extend.generator.register('alias', require('./lib/alias'));

hexo.extend.helper.register('structured_data', require('./lib/structured_data.js'));

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

hexo.extend.tag.register("share_link", function(args){

    const channel = args.shift();

    const { htmlTag } = require('hexo-util');

    if (channel == "facebook") {
        return  htmlTag('a', {
            href: 'https://www.facebook.com/sharer/sharer.php?u=' + this.permalink + '&t=' + this.title,
            title: "Facebook",
            target: "_blank",
            rel: "noopener"
        }, "Facebook");
    }
    if (channel == "twitter") {
        return  htmlTag('a', {
            href: 'https://twitter.com/intent/tweet?text="' + this.title + '" ' + this.permalink + ' via @wololock',
            title: "Twitter",
            target: "_blank",
            rel: "noopener"
        }, "Twitter");
    }
    if (channel == "linkedin") {
        return  htmlTag('a', {
            href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + this.permalink + '&title=' + this.title,
            title: "LinkedIn",
            target: "_blank",
            rel: "noopener"
        }, "LinkedIn");
    }
    return ""
});