/**
 * Call to generate jwt token and store it in redis
 */
var jwt = require('jsonwebtoken');
var randtoken = require('rand-token');

// TODO :: letter on, we put this file in helper

//function generateToken(data){
exports.generateToken = function (data) {
    var secret = 'super.duper.secret.ravi';    // TODO :: fetch secret from config, dont use static
    var refreshId = randtoken.uid(64);
    var refreshTokens = {}
    var refreshToken = randtoken.uid(256);
    refreshTokens[refreshToken] = refreshId;

    // TODO :: STORE refreshId WITH DATA IN REDIS, USEFULL IN CASE OF REFRESH TOKEN

    var token = jwt.sign({
        data: data
    },
        secret,
        { expiresIn: '1h' },
        { algorithm: 'HS256' }
    );

    return { token: token, refreshToken: refreshToken };
}

exports.validateToken = function (token, callback) {
    var secret = 'super.duper.secret.ravi'; // TODO :: fetch secret from config, dont use static
    var response = '';
    // TODO :: HERE HAVE TO CHECK INVALID TOKEN CODE ALSO

    // CHECK REFERER URL WITH AUDIENCE
    // PREPARE OPTIONS WITH AUDIENCE, ISSUER AND SUBJECT
    jwt.verify(token, secret, { algorithms: ['HS256'] }, function (err, decoded) {
        if (err) {
            response = 500;
            callback(response);
        } else {
            if (decoded.exp * 1000 <= Date.now()) {
                response = 400;
                callback(response);
            } else {
                response = 200;
                callback(response);
            }
        }
    })
}

exports.refreshToken = function () { }
