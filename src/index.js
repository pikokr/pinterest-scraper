#!/usr/bin/env node

const commander = require('commander')

const chalk = require('chalk')

commander.arguments('<url>')
    .option('-d, --dir <directory>', 'Output directory')
    .action(async url => {
        const fetch = require('node-fetch')
        const fs = require('fs')
        const puppeteer = require('puppeteer')
        const path = require('path')

        if (!fs.existsSync(commander.dir || './images')) {
            fs.mkdirSync(commander.dir || './images')
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

            console.log(chalk.green('Fetching data....'))

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

            console.log(chalk.green('Downloading images...'))

            await Promise.all(urls.map(r=>{
                return fetch(r).then(res => new Promise((resolve, reject) => {
                    const stream = fs.createWriteStream(path.join(commander.dir || './images/', r.split('/').pop()))
                    res.body.pipe(stream)
                    res.body.on('error', err => {
                        console.log(`Download of ${r} failed.`)
                        stream.close()
                        reject(err)
                    })
                    stream.on('finish', () => {
                        stream.close()
                        console.log(chalk.cyan(`Downloaded ${r}`))
                        resolve()
                    })
                }).catch(e => console.error(e.message)))
            }))
        } catch (e) {
        } finally {
            await browser.close()
        }
    }).parse(process.argv)
