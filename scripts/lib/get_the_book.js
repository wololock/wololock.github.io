'use strict';

const pug = require('pug');

// const ejs = require('ejs');
const fs = require('fs');
const path = require('path');


function get_the_book() {
    var book = this.book || {};
    if (book === undefined) return "";

    //const template = fs.readFileSync(path.resolve(__dirname, '../../templates/book.book'), 'utf-8');

    return pug.renderFile(path.resolve(__dirname, '../../templates/book.pug'), book);
}

module.exports = get_the_book;