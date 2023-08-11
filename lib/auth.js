const jwt = require('jsonwebtoken');

module.exports = secret => {
    const options = { algorithm: 'HS256', expiresIn: '12h' }

    function verify(req) {
        console.log(JSON.stringify(req.headers))
        const auth = req?.headers?.authorization || ""
        return new Promise((res, rej) => {
            const token = auth.startsWith('Bearer ') ? auth.substring(7) : undefined
            if (!token) rej("Token not found")
            try { res(jwt.verify(token, secret)) }
            catch (ex) { rej(ex) }
        })
    }

    return { verify, sign: payload => jwt.sign(payload, secret, options) }
}