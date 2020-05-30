const tf = require('./totp')()
const { prompt } = require('enquirer');
const qr = require('qrcode-terminal');

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
qr.generate(uri, {small: true})

async function startTester() {
  
  const response = await prompt({
    type: 'input',
    name: 'code',
    message: 'Enter TOTP Code:'
  })

  return tf.validateToken(Number(response.code), secret)
}


(function run() {
  return startTester()
    .then(r => console.log('Valid:', r))
    .catch(console.error)
    .finally(run)
})()
