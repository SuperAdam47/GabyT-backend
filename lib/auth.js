const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mail = require('@sendgrid/mail')
const tokenOpt = { algorithm: 'HS256', expiresIn: '12h' }

module.exports = (db, cfg) => {
    mail.setApiKey(cfg.mailKey)

    async function login(req) {
        if (req.body.email && req.body.password) {
            let res = await db.users.findAll({ where: { email: req.body.email } })
            res = await bcrypt.compare(req.body.password, res[0].password.replace("$2y$", "$2a$"))
            if (!res) throw false
            const code = Math.floor(Math.random() * 900_000 + 100_000)
            await db.users.update({ "2FATempPwd": code }, { where: { email: req.body.email } })
            mail.send({
                from: cfg.mailFrom, to: req.body.email, subject: "2FA code",
                text: `Your authentication code: ${code}`,
                html: `<strong>${code}</strong>`
            })
        }
        else if (req.body.email && req.body.code) {
            console.log(req.body)
            const usr = await db.users.findAll({ where: { email: req.body.email, "2FATempPwd": req.body.code } })
            const pro = await db.profiles.findAll({ where: { userID: usr[0].ID } })
            return { name: pro[0].firstName, email: req.body.email, token: jwt.sign({ uid: usr[0].ID }, cfg.jwtSecret, tokenOpt) }
        }
        else if (req.body.credential) {
            let res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.credential}`)
            res = await res.json()
            const usr = await db.users.findAll({ where: { username: res.email } })
            const pro = await db.profiles.findAll({ where: { userID: usr[0].ID } })
            return { name: pro[0].firstName, email: res.email, token: jwt.sign({ uid: usr[0].ID }, cfg.jwtSecret, tokenOpt) }
        }
        else throw false
    }

    function verify(req) {
        return new Promise((res, rej) => {
            const auth = req.headers.authorization
            const token = auth.startsWith('Bearer ') ? auth.substring(7) : undefined
            if (!token) rej("Invalid token")
            try { res(jwt.verify(token, cfg.jwtSecret)) }
            catch (ex) { rej(ex) }
        })
    }

    return { login, verify }
}
