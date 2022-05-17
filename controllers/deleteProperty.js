const db = require('../config/database');

const deleteProperty = (req, res) => {

    const { propertyID } = req.params;

    const deleteQuery = `DELETE From property WHERE propertyID='${ propertyID }'`;
    const details = `SELECT * FROM property WHERE propertyID='${ propertyID }'`;

    db.query(details, (err, ans) => {

        if(err){
            res.status(401).json({
                status: 'error',
                error: err.message
            });
            return;
        }

        db.query(deleteQuery, (err, result) => {

            if(err){
                res.status(401).json({
                    status: 'error',
                    error: err.message
                });
                return;
            }

            if(result.affectedRows > 0){
                res.status(200).json({
                    status: 'success',
                    data: ans
                });
    
                return;
            }
    
            res.status(401).json({
                status: 'error',
                error: 'order id incorrect'
            });
            return; 
        })

         
    });
}

module.exports = deleteProperty;