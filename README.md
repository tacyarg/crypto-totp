# Crypto-TOTP

## Installation
`yarn add crypto-totp`

## Intitalize
```js
const totp = require('crypto-totp')
```

## API

### generateSecret() => `secret<String>`

> Generate a new totp secret, this is what will be revealed to the customer.

```js
const secret = totp.generateSecret()
```

### generateToken(secret`<String>`) => `code<Int>`

> Generate a valid totp code for use in validation. This can be used to build an authenticator app or locally test.

 - `secret` - the value used to generate totp codes

```js
const code = totp.generateToken('supersecret')
```

### validateToken(token`<String>`, secret`<String>`, window*`<Int>`) => `<Boolean>`

> This method is provided to validated a provided totp token. Customer would usually provide this from thier choosen authenticator app or device.

- `token` - the 6 digit token generated.
- `secret` - the secret revealed to the customer during setup.
- `window` - *Optional* the number of previous codes to compare against, default is 1.

```js
const isValid = totp.validateToken(123456, 'supersecret')
```

### generateTotpUri(secret`<String>`, accountName`<string>`, issuer`<String>`, algo*`<String>`, digits*`<Int>`, period*`<Int>`) => `uri<String>`
  
> Generate an ecoded string used to link the customer device. Issuer and account name are combined and displayed in the authenticator app. 
  
- `secret` - the value used to genertae totp codes
- `accountName` - the unique value used to identify the customer.
- `issuer` - the name displayed in the totp app.
- `algo` - *Optional* the encryption algo used.
- `digits` - *Optional* the number of digits to display.
- `period` - *Optional* the length of time the generated code will be valid.
  
```js
const URI = totp.generateTotpUri('supersecret', 'tacyarg', "Project")
console.log(URI) // <String>

//Issuer and account name are displayed in the authenticator app for the customer.
Project:tacyarg
```
