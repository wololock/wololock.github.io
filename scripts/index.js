'use strict'

const asciidoc = require('./lib/asciidoc.js')

hexo.extend.renderer.register('ad', 'html', asciidoc, true)
hexo.extend.renderer.register('adoc', 'html', asciidoc, true)
hexo.extend.renderer.register('asciidoc', 'html', asciidoc, true)

hexo.extend.helper.register('structured_data', require('./lib/structured_data.js'));
