"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.appendValues = appendValues;
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function () {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "combine", {
  enumerable: true,
  get: function () {
    return _languageCommon.combine;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function () {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function () {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function () {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "http", {
  enumerable: true,
  get: function () {
    return _languageCommon.http;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.lastReferenceValue;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.sourceValue;
  }
});

var _languageCommon = require("@openfn/language-common");

var _googleapis = require("googleapis");

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
function execute(...operations) {
  const initialState = {
    references: [],
    data: null
  }; // why not here?

  return state => {
    // Note: we no longer need `steps` anymore since `commonExecute`
    // takes each operation as an argument.
    return (0, _languageCommon.execute)(...operations)({ ...initialState,
      ...state
    });
  };
}
/**
 * Add an array of rows to the spreadsheet.
 * https://developers.google.com/sheets/api/samples/writing#append_values
 * @example
 * execute(
 *   appendValues(params)
 * )(state)
 * @constructor
 * @param {Object} params - Data object to add to the spreadsheet.
 * @returns {Operation}
 */


function appendValues(params) {
  return state => {
    const {
      accessToken
    } = state.configuration;
    const oauth2Client = new _googleapis.google.auth.OAuth2();
    oauth2Client.credentials = {
      access_token: accessToken
    };
    const {
      spreadsheetId,
      range,
      values
    } = (0, _languageCommon.expandReferences)(params)(state);

    var sheets = _googleapis.google.sheets('v4');

    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.append({
        auth: oauth2Client,
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          range,
          majorDimension: 'ROWS',
          values: values
        }
      }, function (err, response) {
        if (err) {
          console.log('The API returned an error:');
          console.log(err);
          reject(err);
        } else {
          console.log('Success! Here is the response from Google:');
          console.log(response);
          resolve(state);
        }
      });
    });
  };
}
