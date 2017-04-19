import { execute as commonExecute, expandReferences } from 'language-common';
import request from 'request';
import { resolve as resolveUrl } from 'url';
import { curry, mapValues, flatten } from 'lodash-fp';

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

/** @module Adaptor */

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @constructor
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
export function execute(...operations) {

  const initialState = {
    references: [],
    data: null
  }

  // why not here?

  return state => {
    // Note: we no longer need `steps` anymore since `commonExecute`
    // takes each operation as an argument.
    return commonExecute(
      function(state) {
        return readFile('client_secret.json').then((fileData) => {
          // console.log(JSON.parse(fileData));
          return authorize(JSON.parse(fileData))(state)
        })
      },
      function(state) {
        console.log(state);
        return state
      },
      ...operations
    )({ ...initialState, ...state })
  };

}

/**
 * Add an array of rows to the spreadsheet.
 * https://developers.google.com/sheets/api/samples/writing#append_values
 */
export function appendValues(params) {

  return state => {

    const { spreadsheetId, range, values } = expandReferences(params)(state);

    var sheets = google.sheets('v4');

    return new Promise((resolve, reject) => {
     sheets.spreadsheets.values.append({
       auth: state.auth,
       spreadsheetId,
       range,
       valueInputOption: 'USER_ENTERED',
       resource: {
         range,
         "majorDimension": "ROWS",
         values: values,
       }
     }, function(err, response) {
       if (err) {
         console.log('The API returned an error: ' + err);
         reject(err);
       } else {
         console.log('Well done, homie. Here is the response:')
         console.log(response);
         resolve(state);
       }
     })
    })
   }

};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {

  return state => {

    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    var tokenPath = TOKEN_PATH

    return readFile(tokenPath)
      .then(token => {
        if (!token) {
          return getNewToken().then((token) => {
            return { ...state, auth: oauth2Client }
          })
        } else {
          oauth2Client.credentials = JSON.parse(token);
          return { ...state, auth: oauth2Client }
        }
      })
  }

};

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    // 'code' is the refresh token....
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

export {
  field,
  fields,
  sourceValue,
  alterState,
  each,
  merge,
  dataPath,
  dataValue,
  lastReferenceValue
}
from 'language-common';
