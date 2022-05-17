const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const login = (req, res) => {
    
    // grap user datails
    const {
        email, password
    } = req.body

    // check if email and password are valid
    const dbQuery = `SELECT userID, email, password, first_name, last_name, isAdmin FROM users WHERE email='${email}'`;
    db.query(dbQuery, (dbErr, result) => {
        if(dbErr){
            res.status(501).json({
                status: 'error',
                error: dbErr.message
            });
            return;
        }

        // if users with given email is not found respond approprately
        if(result.length ===  0){
            res.status(401).json({
                status: 'error',
                error: 'incorrect email or password'
            });
            return;
        }

        // check if user password is correct
        const hashedPasswordFromDb = result[0].password;
        bcrypt.compare(password, hashedPasswordFromDb, (passwordErr, valid) => {
            if(passwordErr){
                res.status(501).json({
                    status: 'error',
                    error: 'incorrect email or password'
                });
                return;
            }
            if(valid){
                const payload = {
                    userId: result[0].userID,
                    isAdmin: result[0].isAdmin
                };
                jwt.sign(payload, process.env.TOKEN_SECRET, (err, tokenValue) => {
                    if(err){
                        res.status(501).json({
                            status: 'error',
                            error: 'hashing error'
                        });
                        return;
                    }

                    res.status(200).json({
                        status: 'success',
                        data: {
                            userId: result[0].user_id,
                            firstName: result[0].first_name,
                            lastName: result[0].last_name,
                            email: result[0].email,
                            token: tokenValue
                        }
                    });
                    return;
                });
                return;
            }

            // for invalid password
            res.status(401).json({
                status: 'error',
                error: 'incorrect email or password'
            });
            return;
        });


    });

};

module.exports = login;