const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const signup = (req, res) => {

    // grap all user inputs
    const {
        email, first_name, last_name, password, phoneNumber, address
    } = req.body;

    const dataSentToDb = {
        email, first_name, last_name, password, phoneNumber, address
    }

    // check if user exists
    const checkUser = `SELECT email FROM users WHERE email='${dataSentToDb.email}'`

    db.query(checkUser,(queryErr, result) =>{
        if(queryErr){
            res.status(401).json({
                status: 'error',
                error: queryErr.message
            });
            return;
        }

        if(result.length > 0){
            res.status(401).json({
                status: 'error',
                error: 'user already exists please login'
            });
            return;
        }

        // hash password
        bcrypt.hash(dataSentToDb.password, 10, (err, hash) => {
            if(err){
                return res.status(500).json({
                    status: 'error',
                    error: err.message
                })
            }  

            // modify user password
            dataSentToDb.password = hash;

            // create user in db

            const queryString = 'INSERT INTO users SET ?'
            db.query(queryString, dataSentToDb, (dbErr, result) => {

                if(dbErr){
                    res.status(500).json({
                        status: 'error',
                        error: dbErr.message
                    })
                    
                    return;
                }

                // generate token and respond
                const payload = {
                    userId: result.insertId,
                    isAdmin: dataSentToDb.is_admin
                }

                jwt.sign(payload, process.env.TOKEN_SECRET, (jwtErr, token) => {
                    if(jwtErr){
                        res.status(500).json({
                            status: 'error',
                            error: jwtErr.message
                        })
                        return;
                    }
   
                    res.status(201).json({
                        status: 'success',
                        data: {
                            userId: result.insertId,
                            firstName: dataSentToDb.first_name,
                            last_name: dataSentToDb.last_name,
                            email: dataSentToDb.email,
                            address: dataSentToDb.address,
                            phoneNumber: dataSentToDb.email,
                            token
                        }
                    })
                    return;
                    
                });
                
                return;
            });

        });
    });

    return;   
};

module.exports = signup;