const mongoose = require('mongoose')

const userSchema = new mognoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: String
})

userSchema.index({ username: 1 })

module.exports = mongoose.model('User', userSchema)