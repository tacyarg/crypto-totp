const tf = require('./')()
const { prompt } = require('enquirer');
const qr = require('qrcode-terminal');

const secret = tf.generateSecret()
const uri = tf.generateTotpUri(secret)

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
