const cloudinary = require('../config/cloudinary');
const db = require('../config/database');

const updateProduct = (req, res) => {
    const { id } = req.params;
    let productImage;
    try {
        productImage = req.files.image || '';
    } catch (error) {
        
    }
    const { 
        status, price, state, city,
        address, type, availabe
    } = req.body;

    const dbData = { 
        status, price, state, city,
        address, type, availabe, owner: req.decoded.userId
    }

    const arr = Object.keys({ 
        status, price, state, city,
        address, type, availabe, owner: req.decoded.userId
    });

    let updateArr = arr.filter((obj) => {
        if(dbData[obj]){
            return obj !== undefined;
        }
    })
    
    if(productImage){
        cloudinary.uploader.upload(productImage.tempFilePath, (err, cloudinaryResult) => {
        
            if(err){
                res.status(401).json({
                    status: "error",
                    error: err.message
                });
                return;
            }
            const { secure_url } = cloudinaryResult;

            const finalUpdateArr = [];
            let queryString = `UPDATE property SET `;
            updateArr.forEach((obj, index, arr) => {
                if(arr.length - 1 === index){
                    finalUpdateArr.push(secure_url);
                    finalUpdateArr.push(dbData[obj]);
                    queryString += `image_url = ?, ${obj} = ? `;
                }else{
                    finalUpdateArr.push(dbData[obj]);
                    queryString += `${obj} = ?, `;
                }
            })

            queryString += `WHERE propertyID = ? AND owner = '${req.decoded.userId}'`;
            finalUpdateArr.push(id);

            db.query(queryString, finalUpdateArr, (dbErr, result) => {

                if(dbErr){
                    res.status(401).json({
                        status: 'error',
                        error: dbErr.message
                    });
                    return;
                }

                if(result.affectedRows > 0){

                    res.status(201).json({
                        status: 'success',
                        data: { 
                            status, price, state, city,
                            address, type, availabe, image_url: secure_url 
                        }
                    });

                    return;
                }else{
                    res.status(401).json({
                        status: 'error',
                        error: 'cannot update product that is not yours'
                    });
                    return;
                }
            })
        
        })
    }else{
        // no image provided for update
        const finalUpdateArr = [];
        let queryString = `UPDATE property SET `;
        updateArr.forEach((obj, index, arr) => {
            if(arr.length - 1 === index){
                finalUpdateArr.push(dbData[obj]);
                queryString += `${obj} = ? `;
            }else{
                finalUpdateArr.push(dbData[obj]);
                queryString += `${obj} = ?, `;
            }
        })

        queryString += `WHERE propertyID = ? AND owner = '${req.decoded.userId}'`;
        finalUpdateArr.push(id);

        db.query(queryString, finalUpdateArr, (dbErr, result) => {

            if(dbErr){
                res.status(401).json({
                    status: 'error',
                    error: dbErr.message
                });
                return;
            }

            if(result.affectedRows > 0){

                res.status(201).json({
                    status: 'success',
                    data: { 
                        status, price, state, city,
                        address, type, availabe
                    }
                });

                return;
            }else{
                res.status(401).json({
                    status: 'error',
                    error: 'cannot update product that is not yours'
                });
                return;
            }
        })
    }

    
}

module.exports = updateProduct;