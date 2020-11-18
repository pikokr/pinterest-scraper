const cheerio = require('cheerio')

const $ = cheerio.load('<div>asdf</div>')

console.log($('div').text())
