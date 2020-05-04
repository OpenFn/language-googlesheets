# Language Google Sheets [![Build Status](https://travis-ci.org/OpenFn/language-googlesheets.svg?branch=master)](https://travis-ci.org/OpenFn/language-googlesheets)

Language Pack for building expressions and operations to make Google Sheets API calls.

## Documentation

## appendValues()

Add rows to an existing sheet: `https://sheets.googleapis.com/v4/spreadsheets/spreadsheetId/values/Sheet1!A1:E1:append?valueInputOption=USER_ENTERED`

```js
appendValues({
  spreadsheetId: '1O-a4_RgPF_p8W3I6b5M9wobA3-CBW8hLClZfUik5sos',
  range: 'Sheet1!A1:E1',
  values: [
    ['From expression', '$15', '2', '3/15/2016'],
    ['Really now!', '$100', '1', '3/20/2016'],
  ],
});
```

#### sample configuration

This is generated automatically via OpenFn.org

```json
"configuration": {
  "name": "Taylor Downs",
  "idToken": "muhaha",
  "picture": "https://lh6.googleusercontent.com/some/photo.jpg",
  "sheetUrl": "https://docs.google.com/spreadsheets/d/mySheet-id/edit#gid=0",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "accessToken": "nu-uh",
  "refreshToken": "no way!"
}
```

[Docs](docs/index)

## Development

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
