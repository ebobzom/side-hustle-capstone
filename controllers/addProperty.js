const cloudinary = require('../config/cloudinary'); 
const db = require('../config/database');

const addProperty = (req, res) => {

    const productImage = req.files.image;

    const {
        type, state, city, address, price,
    } = req.body;

    if(!productImage){
        res.status(401).json({
            status: "error",
            error: 'please select an image'
        });
        return;
    }

    cloudinary.uploader.upload(productImage.tempFilePath, (err, cloudinaryResult) => {
        
        if(err){
            res.status(401).json({
                status: "error",
                error: err.message
            });
            return;
        }
        const { secure_url } = cloudinaryResult;

        const dbData = {
            type, state, city, address, price, image_url: secure_url, owner: req.decoded.userId
        };

        const queryString = `INSERT INTO property SET ?`
        db.query(queryString, dbData, (dbErr, result) => {
            if(dbErr){
                res.status(401).json({
                    status: 'error',
                    error: dbErr.message
                });
                return;
            }

            const newRecordID = result.insertId;

            const record = `SELECT * FROM property WHERE propertyID = '${newRecordID}'`;

            db.query(record, (err, result) => {
                if(err) {
                    res.status(401).json({
                        status: 'error',
                        error: err.message
                    });
                    return;
                }

                res.status(201).json({
                    status: 'success',
                    data: result
                });
            
                return;
            })
        });
    })
}

module.exports = addProperty;

