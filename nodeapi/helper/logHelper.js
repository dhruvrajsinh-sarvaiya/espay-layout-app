const common = require("../config/common");
var fs = require('fs');
var dateFormat = require("dateformat");
var LogResponseFile = 'logs/responseLog/response_' + dateFormat(new Date(), "dd-mm-yyyy") + '.log';
var LogRequestFile = 'logs/requestLog/request_' + dateFormat(new Date(), "dd-mm-yyyy") + '.log';
var ErrorLogFile = 'logs/errorLogs/log_' + dateFormat(new Date(), "dd-mm-yyyy") + '.log';

// function for do error log
exports.errorLog = function (error, methodName) {

  /*write error response in log file*/
  if (common.enableErrorLog == 1) { // check for write log enable or not

    var LogString = '';

    LogString += '==================' + methodName + ' Error Response ' + (dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss")) + '==== \r\n\r\n';

    LogString += error + '\r\n';
    // make file and append error message in it.
    fs.appendFile(common.ProjectRoot + ErrorLogFile, LogString + "\r\n", "utf8", function (err) {
      if (err) {
        return err; // return error
      }
    });
  }
  return true;
};

// function for add response log
exports.requestLog = function (APIRequest, MethodName) {
  // check for write log enable or not
  if (common.enableRequestLog == 1) {

    var LogString = '';

    LogString += '==================' + MethodName + ' Request ' + (dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss")) + '==== \r\n\r\n';

    LogString += JSON.stringify(APIRequest) + '\r\n';
    // make file and append error message in it.
    fs.appendFile(common.ProjectRoot + LogRequestFile, LogString + "\r\n", "utf8", function (err) {
      if (err) {
        return err; // return error
      }
    });
  }
  return true;
};
// function for add response log
exports.responseLog = function (APIResponse, MethodName) {
  // check for write log enable or not
  if (common.enableResponseLog == 1) {

    var LogString = '';

    LogString += '==================' + MethodName + ' Response ' + (dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss")) + '==== \r\n\r\n';

    LogString += JSON.stringify(APIResponse) + '\r\n';
    // make file and append error message in it.
    fs.appendFile(common.ProjectRoot + LogResponseFile, LogString + "\r\n", "utf8", function (err) {
      if (err) {
        return err; // return error
      }
    });
  }
  return true;
};
