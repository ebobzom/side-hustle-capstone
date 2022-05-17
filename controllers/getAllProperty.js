const db = require('../config/database');

const getAllProperty = (req, res) => {

    const details = `SELECT * FROM property`;

    try {
        db.query(details, (err, ans) => {

            if(err){
                return res.status(401).json({
                    status: 'error',
                    error: err.message
                });
            }
    
            return res.status(200).json({
                status: 'success',
                data: ans
            });
             
        });
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            error: error.message
        });
    }
}

module.exports = getAllProperty;