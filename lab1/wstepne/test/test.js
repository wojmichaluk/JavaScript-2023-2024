const validator = require('validator')

// const theEmail = 'abc123'
const theEmail = 'abc@google.com'
console.log(validator.isEmail(theEmail))
