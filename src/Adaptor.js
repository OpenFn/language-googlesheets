import { execute as commonExecute, expandReferences } from 'language-common';
import request from 'request';
import { resolve as resolveUrl } from 'url';
import { curry, mapValues, flatten } from 'lodash-fp';
import google from 'googleapis';

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

    const { accessToken } = state.configuration;

    var OAuth2 = google.auth.OAuth2;
    var oauth2Client = new OAuth2();
        oauth2Client.credentials = { access_token: accessToken };

    const { spreadsheetId, range, values } = expandReferences(params)(state);

    var sheets = google.sheets('v4');

    return new Promise((resolve, reject) => {
     sheets.spreadsheets.values.append({
       auth: oauth2Client,
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
