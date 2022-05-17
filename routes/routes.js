const createUser = require('../controllers/signup');


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

    
    
}

module.exports = routes;