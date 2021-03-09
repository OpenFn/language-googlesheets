import {
  execute as commonExecute,
  expandReferences,
} from '@openfn/language-common';
import { google } from 'googleapis';

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
    data: null,
  };

  // why not here?

  return state => {
    // Note: we no longer need `steps` anymore since `commonExecute`
    // takes each operation as an argument.
    return commonExecute(...operations)({ ...initialState, ...state });
  };
}

/**
 * Add an array of rows to the spreadsheet.
 * https://developers.google.com/sheets/api/samples/writing#append_values
 */
/**
 * Add an array of rows to the spreadsheet.
 * @example
 * execute(
 *   appendValues(params)
 * )(state)
 * @constructor
 * @param {Object} params - Data object to add to the spreadsheet.
 * @returns {Operation}
 */
export function appendValues(params) {
  return state => {
    const { accessToken } = state.configuration;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.credentials = { access_token: accessToken };

    const { spreadsheetId, range, values } = expandReferences(params)(state);

    var sheets = google.sheets('v4');

    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.append(
        {
          auth: oauth2Client,
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          resource: {
            range,
            majorDimension: 'ROWS',
            values: values,
          },
        },
        function (err, response) {
          if (err) {
            console.log('The API returned an error:');
            console.log(err);
            reject(err);
          } else {
            console.log('Success! Here is the response from Google:');
            console.log(response);
            resolve(state);
          }
        }
      );
    });
  };
}

export {
  alterState,
  combine,
  dataPath,
  dataValue,
  each,
  field,
  fields,
  http,
  lastReferenceValue,
  merge,
  sourceValue,
} from '@openfn/language-common';
