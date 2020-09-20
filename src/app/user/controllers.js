
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const { validationResult } = require('express-validator')
const User = mongoose.model("User")
const secretObj = require("../../config/jwt")

exports.register = async (req, res) => {
    const errors = validationResult(req)
    let isSuccess = false
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        let user = new User(req.body)
        const password = await user.createPassword(req.body.password)
        user.password = password
        await user.save()
        isSuccess = true
    } catch (err) {
        console.error(err)
        isSuccess = false
    }
    return res.sendStatus(isSuccess ? 200 : 400)
}

exports.auth = (req, res) => {
    User.findOne({ 'username': req.body.username }).then(user => {
        if (user) {
            return res.sendStatus(400)
        }
        if (user.checkPassword(req.body.password)) {
            let token = jwt.sign(
                {
                    username: req.body.username,
                },
                secretObj.secret,
                {
                    expiresIn: '5m'
                }
            )
            return res.json({ token: token })
        }
        return res.sendStatus(400)
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
        return res.json({
            "username": user.username,
            "nickname": nickname
        })
    } catch (err) {
        console.error(err)
        return res.sendStatus(400)
    }
}

