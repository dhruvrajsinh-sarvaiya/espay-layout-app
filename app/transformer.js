const obfuscatingTransformer = require("react-native-obfuscating-transformer");

module.exports = obfuscatingTransformer({
    /* Insert here any required configuration */
    trace: true //If true, prints a list of files being obfuscated
});