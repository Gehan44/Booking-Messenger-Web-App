const express = require('express')
const cors = require("cors")
const app = express()
const ejs = require('ejs')
const expressSession = require('express-session')
const flash = require('connect-flash')
global.loggedIn = null

//Page Control
const searchController = require('./controllers/searchController.js')
const loginController = require('./controllers/loginController.js')
const logoutController = require('./controllers/logoutController.js')
const mHomeController = require('./controllers/mHomeController.js')
const formController = require('./controllers/formController.js')
const wsHomeController = require('./controllers/wsHomeController.js')
const registerController = require('./controllers/registerController.js')
const sHomeController = require('./controllers/sHomeController.js')
const sformController = require('./controllers/sformController.js')

//Function
const loginUserFunction = require('./functions/loginUserFunction.js')
const searchFunction = require('./functions/searchwsFunction.js')
const storeTrackFunction = require('./functions/storeTrackFunction.js');
const storeUserFunction = require('./functions/storeUserFunction.js')
const editFunction = require('./functions/editFunction')
const editFailedFunction = require('./functions/failedEditFunction')

//Middleware
const redirectIfAuth = require('./middleware/redirectifAuth')
const wealthsMiddleware = require('./middleware/wealthsMiddleware.js')
const messMiddleware = require('./middleware/messMiddleware.js')

app.use(cors());
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use("*",(req,res,next) =>{
    next()
})

const hours = 2;
app.use(expressSession({secret: "node sercet", cookie: { maxAge: hours * 60 * 60 * 1000 }}))
app.set('view engine','ejs')

//app.all('/', async function(req, res) {
//    if (req.session.user){
//        try {
//            const userData = req.session.user;
//            if (userData.role === 'Messenger') {
//                res.redirect('/mHome');
//            } else if (userData.role === 'Wealth Support') {
//                res.redirect('/wsHome');
//            }
//        } catch (error) {
//            console.error(error);
//            res.redirect('/login');
//        }
//    } else {
//        res.redirect('/login');
//    }
//});

app.all('/', async function(req, res) {
    res.redirect('/login');
});

//Login
app.get('/login',loginController)
app.post('/user/login',loginUserFunction)

//Wealth Support
app.get('/wsHome',wsHomeController)
app.get('/search',searchController)
app.post('/search/run',searchFunction)
app.get('/form',formController)
app.post('/track/form',storeTrackFunction)

//Sale
app.get('/sHome',sHomeController)
app.get('/sform',sformController)

//Messenger
app.get('/mHome',messMiddleware,mHomeController)
app.post('/mHome/edit',messMiddleware,editFunction)
app.post('/mHome/edit/failed',messMiddleware,editFailedFunction)

app.get('/register',registerController)
app.post('/user/register',storeUserFunction)
app.get('/logout',logoutController)

//Server
//const http = require('http');
//const hostname = 'wealth-han-tracker';
const hostname = '192.168.105.54';
let port = process.env.PORT || 3000;
module.exports = { hostname,port };

app.listen(port, () => {
        console.log(`Server running at http://${hostname}:${port}`)
});

//app.listen(port,() => {
//    console.log(`Server running at http://${port}`)
//})