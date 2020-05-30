const totp = require('notp').totp;
const crypto = require('crypto')
const base32 = require('hi-base32');

module.exports = function () {
  const clock = () => Math.floor(Date.now() / 30000);

  function generateSecret(length = 20) {
    const randomBuffer = crypto.randomBytes(length);
    return base32.encode(randomBuffer).replace(/=/g, '');
  }
  
  function dynamicTruncationFn(hmacValue) {
    const offset = hmacValue[hmacValue.length - 1] & 0xf;
  
    return (
        ((hmacValue[offset] & 0x7f) << 24) |
        ((hmacValue[offset + 1] & 0xff) << 16) |
        ((hmacValue[offset + 2] & 0xff) << 8) |
        (hmacValue[offset + 3] & 0xff)
    );
  }

  // NOTE: generates 7 digit tokens.
  function generateToken(secret, window=0) {
    let counter = clock() + window
    const decodedSecret = base32.decode.asBytes(secret);
    const buffer = Buffer.alloc(8);
    for (let i = 0; i < 8; i++) {
        buffer[7 - i] = counter & 0xff;
        counter = counter >> 8;
    }
  
    // Step 1: Generate an HMAC-SHA-1 value
    const hmac = crypto.createHmac('SHA1', Buffer.from(decodedSecret));
    hmac.update(buffer);
    const hmacResult = hmac.digest();
  
    // Step 2: Generate a 4-byte string (Dynamic Truncation)
    const code = dynamicTruncationFn(hmacResult);
  
    // Step 3: Compute an HOTP value
    return code % 10 ** 6;
  }

  //NOTE: window is the number of previous tokens to compare against. 
  function validateToken(token, secret, window = 1) {
    if (Math.abs(+window) > 10) {
        console.error('Window size is too large');
        return false;
    }
  
    for (let errorWindow = -window; errorWindow <= +window; errorWindow++) {
        const totp = generateToken(secret, errorWindow);
        if (token === totp) {
          return true;
        }
    }
  
    return false;
  }
  
  function generateTotpUri(secret=generateSecret(), accountName, issuer="totp_test", algo="SHA1", digits=6, period=30) {
    if(!accountName) accountName = secret
    // Full OTPAUTH URI spec as explained at
    // https://github.com/google/google-authenticator/wiki/Key-Uri-Format
    return 'otpauth://totp/'
      + encodeURI(issuer) + ':' + encodeURI(accountName)
      + '?secret=' + secret.replace(/[\s\.\_\-]+/g, '').toUpperCase()
      + '&issuer=' + encodeURIComponent(issuer)
      + '&algorithm=' + algo
      + '&digits=' + digits
      + '&period=' + period
  }

  return {
    generateSecret,
    generateToken,
    validateToken,
    generateTotpUri 
  }
}
