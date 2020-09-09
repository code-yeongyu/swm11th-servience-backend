
const mongoose = require('mongoose')
const User = mongoose.model("User")
const jwt = require("jsonwebtoken")
const secretObj = require("../../config/jwt")
const { validationResult } = require('express-validator')
const errorCodes = require('../../errors/codes.js')
const errorWithMessage = require('../../utils/error_message.js')

exports.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        let user = new User(req.body)
        const password = await user.createPassword(req.body.password)
        user.password = password
        await user.save()
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(400)
    }
}

exports.auth = (req, res) => {
    User.findOne({ 'username': req.body.username }).then(user => {
        if (user) {
            if (user.checkPassword(req.body.password)) {
                let token = jwt.sign({
                    username: req.body.username,   // 토큰의 내용(payload)
                },
                    secretObj.secret,    // 비밀 키
                    {
                        expiresIn: '5m'    // 유효 시간은 5분
                    })
                res.json({ token: token })
                return
            }
        }
        res.sendStatus(400)
    })
}

exports.getProfile = async (req, res) => {
    const user = await User.findOne({ 'username': req.username })
    return res.json({
        "username": user.username,
        "nickname": user.nickname
    })
}

exports.editProfile = async (req, res) => {
    try {
        const { nickname, password } = req.body
        const user = await User.findOne({ 'username': req.username })
        if (nickname) {
            user.nickname = nickname
        }
        if (password) {
            user.password = user.createPassword(password)
        }
        user.save()
        res.json({
            "username": user.username,
            "nickname": nickname
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
}

