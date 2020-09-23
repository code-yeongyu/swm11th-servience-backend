const codes = require('./codes.js')

module.exports = {
    [codes.FormError]: "Form error.",
    [codes.UsernameExists]: "The username already exists.",
    [codes.UsernameFormatError]: "The username must be alphanumeric.",
    [codes.PasswordVulnerable]: "The password must contain at least 8 characters."
}