var jwt = require('jsonwebtoken');

function validateLocalRequest(req, res, next) {
    console.log('in validate local request method');
    // console.log(req.url);
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == 'JWT') {
        var token = req.headers.authorization.split(' ')[1];
        var secret = 'super.duper.secret.ravi';

        jwt.verify(token, secret, { algorithms: ['HS256'] }, function (err, decoded) {
            if (err) {
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "Oops something went wrong",
                    "error": err
                });
                return;

            } else {
                console.log(Date.now());
                if (decoded.exp * 1000 <= Date.now()) {
                    res.status(400);
                    res.json({
                        "status": 400,
                        "message": "Token Expired"
                    });
                    return;
                }
                next();
            }
        })

    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token"
        });
        return;
    }
    return;
};
