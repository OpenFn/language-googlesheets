Language Google Sheets [![Build Status](https://travis-ci.org/OpenFn/language-googlesheets.svg?branch=master)](https://travis-ci.org/OpenFn/language-googlesheets)
======================

Language Pack for building expressions and operations to make Google Sheets API calls.

Documentation
-------------
## addRow

`https://sheets.googleapis.com/v4/spreadsheets/spreadsheetId/values/Sheet1!A1:E1:append?valueInputOption=USER_ENTERED`

```json
{
  "values": [
    ["Door", "$15", "2", "3/15/2016"],
    ["Engine", "$100", "1", "3/20/2016"],
  ],
}
```


#### sample configuration
```json
{
  "name": "Taylor Downs",
  "idToken": "meh-and-blah",
  "picture": "https://lh6.googleusercontent.com/blah",
  "sheetUrl": "https://docs.google.com/spreadsheets/d/some-sheet",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "accessToken": "something",
  "refreshToken": "xyz"
}
```

#### sample addRow expression
```js
addRow({"values": [
  "Volvo", "204DL", 1991
]});
```

[Docs](docs/index)


Development
-----------

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
