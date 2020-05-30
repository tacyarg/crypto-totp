const tf = require('./totp')()
const qr = require('qrcode-terminal')

const Runner = (onTick=x=>x, ticks=100) => {
  let counter = 0;
  let results = []

  while(counter < ticks){
    counter++
    const res = onTick()
    if(res) results.push(res)
  }

  return results
}

function one() {
  const secret = tf.generateSecret()
  const token = tf.generateToken(secret)
  const valid = tf.validateToken(token, secret)
  
  return {secret, token, valid}
}

function two(secret) {
  const token = tf.generateToken(secret)
  const valid = tf.validateToken(token, secret)
  
  return {secret, token, valid}
}

const secret = tf.generateSecret()
const uri = tf.generateTotpUri(secret)
//const resOne = Runner(one)
//const resTwo = Runner(x => two(secret))  
//console.log(resOne, resTwo)

console.log("TOTP URI:", uri)
qr.generate(uri)
console.log("Token:", tf.generateToken(secret))
console.log('valid token?:', tf.validateToken(tf.generateToken(secret), secret))