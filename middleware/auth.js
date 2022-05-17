const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

    jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, decoded) => {
        
        if(err){
            res.status(401).json({
                status: 'error',
                error: 'please login'
            });
            return;
        }else{
            req.decoded = decoded
            next()
        }
    })
}

module.exports = auth;