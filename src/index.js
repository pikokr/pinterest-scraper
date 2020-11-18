(async () => {
    //const fetch = require('node-fetch')
    const fs = require('fs')
    const puppeteer = require('puppeteer')
    //const uuid = require('uuid').v4
    //const progress = require('cli-progress')

    if (!fs.existsSync('./images')) {
        fs.mkdirSync('./images')
    }

    const width = 400
    const height = 900

    const options = {
        headless: false,
        slowMo: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            `--window-size=${width},${height}`,
        ]
    }

    const browser = await puppeteer.launch(options)

    const page = (await browser.pages())[0] || await browser.newPage()

    console.log(page)

    const url = 'https://www.pinterest.co.kr/Tinaaa_1709/kafuu-chino/'
    /**
     * @type {string}
     */
    //const res = await fetch(url).then(res => res.text())


    //console.log(Array.from(dom.window.document.querySelectorAll('img').values()).map(i => i.getAttribute('src')))

    /*

    const cheerio = require('cheerio')

    const $ = cheerio.load(res)

    /*const bar = new progress.SingleBar({}, progress.Presets.shades_classic)

    /**
     * @type {string[]}
     *
    const urls = $('img[src]').toArray().map(r=>r.attribs.src)

    bar.start(urls.length, 0)

    await Promise.all(urls.map(r=>{
        return fetch(r).then(res => new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(`./images/${uuid()}.png`)
            res.body.pipe(stream)
            res.body.on('error', err => {
                console.log(`Download of ${r} failed.`)
                bar.increment()
                stream.close()
                reject(err)
            })
            stream.on('finish', () => {
                bar.increment()
                stream.close()
                resolve()
            })
        }))
    }))

    bar.stop()*/
})()