/**
 * Call Core api to generate jwt token and store it with local token in redis
 */
// TODO :: letter on, we put this file in helper
var jwt = require('jsonwebtoken');
var randtoken = require('rand-token');

function generateToken(data) {
    var secret = 'super.duper.secret.ravi';
    var user = randtoken.uid(64);
    var refreshTokens = {}
    var refreshToken = randtoken.uid(256);
    refreshTokens[refreshToken] = user;

    var token = jwt.sign({
        data: data
    },
        secret,
        { expiresIn: '1h' },
        { algorithm: 'HS256' }
    );

    return { token: token, refreshToken: refreshToken };
}

function validateToken(token) {

    var secret = 'super.duper.secret.ravi';

    jwt2.verify(token, secret, { algorithms: ['HS256'] }, function (err, decoded) {
        if (err) {
            return false;
        } else {
            return true;
        }
    })
}