const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const repl = require("puppeteer-extra-plugin-repl")({ addToPuppeteerClass: false })
const { executablePath } = require("puppeteer")
//const markup = new require("turndown")()
puppeteer.use(StealthPlugin())
puppeteer.use(repl)

function removeHidden() {
    document.querySelectorAll('[hidden], [style*="display: none"], [style*="visibility: hidden"]')
        .forEach(el => el.remove())
}

function justHTML(html) {
    return html
        .replace(/<meta\b[^<]*\/?>/gi, "")
        .replace(/<link\b[^<]*\/?>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/\sclass\s*=\s*[""][^""]*[""]/gi, "")
        .replace(/\sstyle\s*=\s*[""][^""]*[""]/gi, "")
        .replace(/\sid\s*=\s*[""][^""]*[""]/gi, "")
        .replace(/src=([""`])(data:image\/[^""`]+\1)/gi, "")
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<span\b[^>]*>|<\/span\b[^>]*>/g, "")
        .replace(/<nav\b[^>]*>|<\/nav\b[^>]*>/g, "")
        .replace(/<!--([\s\S]*?)-->/g, "")
        .replace(/^\s*[\r\n]/gm, "")
        .replace(/(\s{2,}|\n\s)+/g, " ")
}

function minHTML(html) {
    return html
        .replace(/<input\b[^<]*\/?>/gi, "")
        .replace(/<label\b[^<]*(?:(?!<\/label>)<[^<]*)*<\/label>/gi, "")
        .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
        .replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, "")
        .replace(/<img\b[^<]*\/?>/gi, "")
        .replace(/<a [^>]*>([\s\S]*?)<\/a>/g, "$1")
        .replace(/<div\b[^>]*>/g, "")
        .replace(/<\/div>/g, "<br>")
        .replace(/[\r\n]/gm, " ")
        .replace(/\s{2,}/g, " ")
        .replace(/\s*<\s*([^>]+)\s*>\s*/g, "<$1>")
        .replace(/<li><\/li>/g, "")
        .replace(/<br\s*\/?>\s*(<br\s*\/?>)+/g, "<br>")
}

function markdown(html) {
    return html
        .replace(/[\r\n]/gm, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/<b>([\s\S]*?)<\/b>/g, "**$1**")
        .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, "**$1**")
        .replace(/<i>([\s\S]*?)<\/i>/g, "*$1*")
        .replace(/<em[^>]*>([\s\S]*?)<\/em>/g, "*$1*")
        .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, "\n# $1 #\n")
        .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "\n## $1 ##\n")
        .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "\n### $1 ###\n")
        .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, "\n#### $1 ####\n")
        .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/g, "\n##### $1 #####\n")
        .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/g, "\n###### $1 ######\n")
        .replace(/<\/?p>/gi, "\n")
        .replace(/<br>/gi, "\n")
        .replace(/<hr>/gi, "\n---\n")
        .replace(/<li>/gi, "\n- ")
        .replace(/<\/?blockquote>/gi, "> ")
        .replace(/<\/?code>/gi, "`")
        .replace(/<\/?pre>/gi, "'''")
        .replace(/<table>/gi, "\n")
        .replace(/<\/tr[^>]*>/gi, "\n")
        .replace(/<\/td>/gi, "|")
        .replace(/<\/th>/gi, "|")
        .replace(/<tbody>/gi, "| --- |")
        .replace(/<[^>]+>/g, " ")
        .replace(/^\s*[\r\n]/gm, "")
        .replace(/\s+$/gm, "")
        .replace(/[^\S\n]{2,}/g, " ")
}

module.exports = () => {
    return puppeteer.launch({
        args: ["--no-sandbox"],
        headless: "new",
        ignoreHTTPSErrors: true,
        executablePath: executablePath()
    }).then(browser => ({
        load: (url, hidden) => url ? browser.newPage()
            .then(page => {
                page.setDefaultNavigationTimeout(0)
                return page.goto(url.startsWith("http") ? url : "http://" + url, { waitUntil: "networkidle0" })
                    .then(() => { if (!hidden) return page.evaluate(removeHidden) }) // false.. hide
                    .then(() => page.evaluate(() => document.querySelector("*").outerHTML))
                    .then(html => {
                        page.close()
                        html = justHTML(html)
                        return {
                            get html() { return html }, // all loaded
                            get htm() { return minHTML(html) }, // remove inputs and images
                            get txt() { return minHTML(html).replace(/<\/[^>]+>/g, "\n").replace(/<[^>]+>/g, "").replace(/^\s*[\r\n]/gm, "") }, // remove tags
                            get md() { return markdown(minHTML(html)) },
                            get a() { // array of anchors
                                const matches = {}
                                const anchor = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
                                let next
                                while (next = anchor.exec(html)) if (!next[2].startsWith('#')) matches[next[2]] = true
                                return Object.keys(matches).map(ref => ref)
                            }
                        }
                    })
            }) : Promise.resolve(),
        close: () => browser.close()
    }))
}