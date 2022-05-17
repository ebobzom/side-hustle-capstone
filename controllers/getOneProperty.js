const db = require('../config/database');

const getOneProperty = (req, res) => {

    const { propertyID } = req.params;
    const details = `SELECT * FROM property WHERE propertyID='${ propertyID }'`;

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
            error: 'property id incorrect'
        });
    }
}

module.exports = getOneProperty;