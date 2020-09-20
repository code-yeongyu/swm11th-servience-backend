const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema


const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String }
})

userSchema.index({ username: 1 })

userSchema.methods.createPassword = async (password) => {
    const bcrypt = require('bcrypt')
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

userSchema.methods.checkPassword = async (password) => {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)