const createUser = require('../controllers/signup');
const login = require('../controllers/login');
const auth = require('../middleware/auth');

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

    
    
}

module.exports = routes;