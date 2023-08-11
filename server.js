const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cfg = require("./config.json")
const auth = require("./lib/auth.js")(cfg.secret)
const scraper = require("./lib/scraper.js")
const gpt = require("./lib/gpt.js")(cfg)
const juice = require("./lib/juice.js")

let browser
scraper().then(res => browser = res)

app.use(bodyParser.json({ limit: "50mb" }))

app.get(cfg.route + "/scrape", (req, res) => {
  browser.load(req.query.url)
    .then(page => res.send(page[req.query.target || "html"]))
    .catch(ex => res.status(400).send("Server error"))
})

app.post(cfg.route + "/juice", (req, res) => {
  auth.verify(req).then(info => {
    const q = req.body
    const ref = q.link ? browser.load(q.link).then(page => page.txt) : Promise.resolve()
    ref.then(txt => gpt.lang(juice[q.task](q), q.doc, txt, q.heat || juice.heated.includes(q.task) ))
      .then(result => res.json({ result }))
      .catch(ex => res.status(400).send("Server error:" + ex))
  }).catch(ex => res.status(500).send(ex))
})

app.listen(cfg.port, "localhost", () => { console.log(`Server listening on ${cfg.port}`) })