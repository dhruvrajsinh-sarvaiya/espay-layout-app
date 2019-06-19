var redisConfig = require('../config/redis.js');

var coreAPI = 'http://some.server.com/';

function validateNodeToken(token = '', secret = '') {
  if (token) { }
}

function getSessionToken(token = '') {
  var sessionToken = '';
  if (token) {
    // TODO :: FETCH SESSION TOKEN FROM REDIS, BY PASSING TOKEN
    // create and connect redis client to local instance.
    const redisClient = Redis.createClient('redis://' + redisConfig.redisHost + ':' + redisConfig.redisPort);

    redisClient.on('ready', function () {

      redisClient.hgetall(token, function (err, reply) {
        if (err) { } else {
          sessionToken = reply.sessionToken;
        }
      });
    });

    redisClient.on('error', function () { });
  }
  return sessionToken;
}

function validateSessionToken(sessionToken) {

  Request.post({
    "headers": { "content-type": "application/json", 'auth': { 'bearer': sessionToken } },
    "url": coreAPI,
    "body": JSON.stringify({})
  }, (error, response, body) => {

    if (error) {
      return json({
        "status": 500,
        "message": "API Error Occured"
      });
    }

    body = JSON.parse(body);
    newToken = '';

    if (body.newToken) {
      newToken = body.newToken;
    }

    return {
      "status": body.status,
      "message": body.message,
      "newToken": newToken
    };
  });
}

function generateNodeToken(token, sessionToken, newToken) { }

exports.validateTestRequest = function (req, res, next) {
  next();
};