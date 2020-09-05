const jwt = require("jsonwebtoken")
const secretObj = require("../config/jwt.js")

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (authHeader === undefined) {
        res.sendStatus(401)
        return
    }
    const authMethod = authHeader.slice(0, 3)
    const jwtToken = authHeader.slice(4)
    if (authMethod !== 'jwt') {
        res.sendStatus(401)
        return
    }
    jwt.verify(jwtToken, secretObj.secret, (err, decoded) => {
        if (!err) {
            req.username = decoded.username
            next()
        } else {
            res.send(400, err.name)
            return
        }
    })
}