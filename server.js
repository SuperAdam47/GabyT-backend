const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cfg = require("./config.json")
const db = require("./lib/db.js")(cfg)
const auth = require("./lib/auth.js")(db, cfg)
const gpt = require("./lib/gpt.js")(cfg)
const juice = require("./lib/juice.js")
const scraper = require("./lib/scraper.js")

let browser
scraper().then(res => browser = res)
app.use(bodyParser.json({ limit: "50mb" }))
//db.sync()

app.post(cfg.route + "/login", (req, res) => {
  auth.login(req).then(user => {
    if (user) res.json(user)
    else res.send("ok")
  }).catch(ex => res.status(500).send("Login failure:" + ex))
})

app.post(cfg.route + "/juice", (req, res) => {
  auth.verify(req).then(user => {
    const q = req.body
    const r = q.task == "custom"
      ? db.prompts.findAll({ where: { userID: user.uid, promptName: q.value } })
        .then(([result]) => Object.assign(q, { persona: result.persona, value: result.prompt, link: result.referenceink }))
      : Promise.resolve()
    r.then(() => q.link ? browser.load(q.link).then(page => page.txt) : Promise.resolve())
      .then(txt => gpt.lang(juice[q.task](q), q.doc, txt, q.heat || juice.heated.includes(q.task)))
      .then(result => res.json({ result }))
      .catch(ex => res.status(400).send("Server error:" + JSON.stringify(ex)))
  }).catch(ex => res.status(500).send(ex))
})

app.use(cfg.route + "/prompts", (req, res) => {
  auth.verify(req).then(user => (() => {
    if (req.method == "DELETE" && !req.body.ID) throw false
    const criteria = { where: { userID: user.uid } }
    if (req.body?.ID) criteria.where.ID = req.body.ID

    switch (req.method) {
      case "GET": return db.prompts.findAll(criteria).then(rec => res.json(rec))
      case "POST": req.body.userID = user.uid
        return (req.body.ID ? db.prompts.destroy(criteria) : Promise.resolve())
          .then(() => db.prompts.create(req.body))
          .then(record => res.json(record.ID))
      case "DELETE": return db.prompts.destroy(criteria).then(result => res.send("ok"))
      default: throw false
    }
  })().catch(ex => res.status(400).send("Invalid request:" + JSON.stringify(ex)))
  ).catch(ex => res.status(500).send(ex))
})

app.use(cfg.route + "/user", (req, res) => {
  auth.verify(req).then(user => (() => {
    const criteria = { where: { userID: user.uid } }
    
    switch (req.method) {
      case "GET": return db.profiles.findAll(criteria).then(rec => res.json(rec))
      case "POST": req.body.userID = user.uid
        return db.profiles.destroy(criteria).catch(ex => {})
          .then(() => {
            console.log(req.body)
            return db.profiles.create(req.body)
          })
          .then(record => res.json(record.ID))
      default: throw false
    }
  })().catch(ex => res.status(400).send("Invalid request"))
  ).catch(ex => res.status(500).send(ex))
})

app.get(cfg.route + "/scrape", (req, res) => {
  browser.load(req.query.url)
    .then(page => res.send(page[req.query.target || "html"]))
    .catch(ex => res.status(400).send("Server error"))
})

app.listen(cfg.port, "localhost", () => { console.log(`Server listening on ${cfg.port}`) })