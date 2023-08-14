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
  }).catch(ex => {console.log(ex); res.status(500).send("Login failure")})
})

app.post(cfg.route + "/juice", (req, res) => {
  auth.verify(req).then(user => {
    const q = req.body
    const ref = q.link ? browser.load(q.link).then(page => page.txt) : Promise.resolve()
    ref.then(txt => gpt.lang(juice[q.task](q), q.doc, txt, q.heat || juice.heated.includes(q.task)))
      .then(result => res.json({ result }))
      .catch(ex => res.status(400).send("Server error:" + JSON.stringify(ex)))
  }).catch(ex => res.status(500).send(ex))
})

app.use(cfg.route + "/prompts", (req, res) => {
  auth.verify(req).then(user => (() => {
    //if (req.method == "DELETE" && !req.body.ID) throw false
    if (["PUT", "DELETE"].includes(req.method) && !req.body.ID) throw false
    const criteria = { where: { userID: user.uid } }
    if (req.body?.ID) criteria.where.ID = req.body.ID
    let prm = Promise.resolve()
    switch (req.method) {
      case "GET": return db.prompts.findAll(criteria).then(rec => res.json(rec))
      case "PUT": prm = db.prompts.destroy(criteria) // next recreate
      case "POST": req.body.userID = user.uid
        return prm.then(() => db.prompts.create(req.body))
          .then(record => res.json({ id: record.ID }))
      /*    case "POST": req.body.userID = user.uid
              return (req.body.ID ? db.prompts.destroy(criteria) : Promise.resolve())
                .then(() => db.prompts.create(req.body))
                .then(record => res.json({ id: record.id })) */
      case "DELETE": return db.prompts.destroy(criteria).then(() => res.send("ok"))
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