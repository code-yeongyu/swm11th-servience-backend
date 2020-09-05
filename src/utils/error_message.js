const messages = require('../errors/messages.js')
module.exports = (errorCode) => {
    return { 'errorCode': errorCode, 'messages': messages[errorCode] };
}