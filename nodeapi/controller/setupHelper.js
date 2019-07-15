/**
 * Create By : Bharat Jograna
 * Created Date 20 Jun 2019
 * Validation for Denial of Service Prevention
*/

var Ddos = require('ddos');

// To validate user for DOS
exports.validateDenialofService = function () {

    var ddos = new Ddos({
        burst: 15000, // allow burst request after this will increase block time
        checkinterval: 1, //after 1 sec log will show in console if testmode is true
        maxexpiry: 300,// max block for this time
        trustProxy: true,
        includeUserAgent: true,
        whitelist: [],
        errormessage: 'Too Many Requests!',
        testmode: false,
        responseStatus: 429
    });

    return ddos.express;

};
