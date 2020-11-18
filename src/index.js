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

    const page = await browser.newPage()

    const pageDown = async () => {
        const scrollHeight = 'document.body.scrollHeight';
        let previousHeight = await page.evaluate(scrollHeight);
        await page.evaluate(`window.scrollTo(0, ${scrollHeight})`);
        await page.waitForFunction(`${scrollHeight} > ${previousHeight}`, {
            timeout: 30000
        })
    }

    const url = 'https://www.pinterest.co.kr/detols57/%EC%B9%98%EB%85%B8/'

    await page.goto(url)

    const getPages = () => page.evaluate(() => document.querySelectorAll('[data-test-id=pinGrid] img').length)

    let prev = await getPages()

    let i = 0

    while (true) {
        await pageDown()
        const pages = await getPages()

        console.log(prev)

        console.log(pages)

        if (prev === pages) {
            break
        }

        prev = pages

        console.log(`Loop #${i++}`)
    }

    await Promise.all((await browser.pages()).map(r=>r.close()))

    process.exit()

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