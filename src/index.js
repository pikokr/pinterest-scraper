#!/usr/bin/env node

const commander = require('commander')

/*(async () => {
    const fetch = require('node-fetch')
    const fs = require('fs')
    const puppeteer = require('puppeteer')
    const progress = require('cli-progress')

    if (!fs.existsSync('./images')) {
        fs.mkdirSync('./images')
    }

    const width = 400
    const height = 900

    const options = {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            `--window-size=${width},${height}`,
        ]
    }

    const browser = await puppeteer.launch(options)

    const bar = new progress.SingleBar({}, progress.Presets.shades_classic)

    try {
        const page = (await browser.pages())[0] || await browser.newPage()

        const pageDown = async () => {
            const scrollHeight = 'document.body.scrollHeight';
            let previousHeight = await page.evaluate(scrollHeight);
            await page.evaluate(`window.scrollTo(0, ${scrollHeight})`);
            await page.waitForFunction(`${scrollHeight} > ${previousHeight}`, {
                timeout: 30000
            })
        }

        const url = process.argv[process.argv.length-1]

        console.log('Fetching data....')

        await page.goto(url)

        const getPages = () => page.evaluate(() => window.document.querySelectorAll('[data-test-id=pinGrid]')[0].querySelectorAll('img[src]').length)

        let prev = await getPages()

        while (true) {
            await pageDown()
            const pages = await getPages()

            if (prev === pages) {
                break
            }

            prev = pages
        }

        const urls = await page.evaluate(() => Array.from(window.document.querySelectorAll('[data-test-id=pinGrid]')[0].querySelectorAll('img[src]').values()).map(r=>r.getAttribute('src')))

        console.log('Downloading...')

        bar.start(urls.length-1, 0)

        await Promise.all(urls.map(r=>{
            return fetch(r).then(res => new Promise((resolve, reject) => {
                const stream = fs.createWriteStream(`./images/${r.split('/').pop()}`)
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
            }).catch(e => console.error(e.message)))
        }))
    } catch (e) {
    } finally {
        await browser.close()
        bar.stop()
    }

})()*/