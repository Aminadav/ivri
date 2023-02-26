
const crypto = require('crypto');
const googleAuth = require('./google-auth');
const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

var email='tvtv4u@gmail.com'
var email='byehuda@jbha.org'
var email='benaya@gmail.com'

console.log(encrypt(email))