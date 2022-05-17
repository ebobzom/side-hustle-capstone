const createUser = require('../controllers/signup');
const login = require('../controllers/login');
const auth = require('../middleware/auth');
const addProperty = require('../controllers/addProperty');
const updateProduct = require('../controllers/updateProperty');
const deleteProduct = require('../controllers/deleteProperty');
const getOneProduct = require('../controllers/getOneProperty');
const getAllProduct = require('../controllers/getAllProperty');
const getPropertyWithType = require('../controllers/getPropertyWithType');

function routes(app){
    let version = '/api/v1';
    
    // register
    app.get(`${version}/home/:id`, (req, res) =>{
        return res.status(200).json({
            msg: 'welcome'
        });
    });

    // register
    app.post(`${version}/auth/signup`, createUser);

    // login
    app.post(`${version}/auth/signin`, login);

    // add property
    app.post(`${version}/property`, auth, addProperty);

    // update property
    app.patch(`${version}/property/:id`, auth, updateProduct);

    // delete property
    app.delete(`${version}/property/:propertyID`, auth, deleteProduct);

    // get all property by type
    app.get(`${version}/property/search`, auth, getPropertyWithType);

    // get one property
    app.get(`${version}/property/:propertyID`, auth, getOneProduct);

    // get all property
    app.get(`${version}/property`, auth, getAllProduct);
    
}

module.exports = routes;