/**
 * Create By : Bharat Jograna
 * Created Date 19 Jun 2019
 * Validation for XSS Sanitize HTML
*/

var sanitizeHtml = require('sanitize-html');

// To validate html page of front 
exports.validateXssSanitizeHtml = function (data) {

    var sanitizeData = sanitizeHtml(data, {

        // HTML tag that we allow to inser into editor or input
        allowedTags: ['h4', 'h6', 'p', 'ol', 'li', 'div', 'pre'],

        // HTML attributes that we allow
        allowedAttributes: { a: ['href'], img: ['src'] },

        // self closing tag that we allow
        selfClosing: ['img'],

        // URL schemes we permit
        allowedSchemes: ['http', 'https', 'ftp', 'mailto'],

        // Schemes by tag we are not alllowing
        allowedSchemesByTag: {},

        //Schemes that we allow 
        allowedSchemesAppliedToAttributes: ['src', 'href'],

        allowProtocolRelative: true

    });

    return sanitizeData;
};
