const express = require('express')
const cors = require("cors")
const app = express()
const ejs = require('ejs')
const session  = require('express-session')
const MemoryStore = require('memorystore')(session)
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
const ssearchController = require('./controllers/ssearchController.js')

//Function
const loginUserFunction = require('./functions/loginUserFunction.js')
const searchwsFunction = require('./functions/searchwsFunction.js')
const searchsFunction = require('./functions/searchsFunction.js')
const storeTrackFunction = require('./functions/storeTrackFunction.js')
const sstoreTrackFunction = require('./functions/sstoreTrackFunction.js')
const storeUserFunction = require('./functions/storeUserFunction.js')
const editFunction = require('./functions/editFunction')
const editFailedFunction = require('./functions/failedEditFunction')
const cusautofillFunction = require('./functions/cusautofillFunction.js')
const dispautofillFunction = require('./functions/dispautofillFunction.js')
const salecusautofillFunction = require('./functions/scusautofillFunction.js')

//Middleware
const redirectIfAuth = require('./middleware/redirectifAuth')
const wealthsMiddleware = require('./middleware/wealthsMiddleware.js')
const messMiddleware = require('./middleware/messMiddleware.js')
const saleMiddleware = require('./middleware/saleMiddleware.js')

app.use(cors());
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use("*",(req,res,next) =>{
    next()
})

const hours = 2;
app.use(session ({
    cookie: { maxAge: hours * 60 * 60 * 1000  },
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

app.set('view engine','ejs')

app.all('/', async function(req, res) {
    if (req.session.user){
        try {
            const userData = req.session.user;
            if (userData.role === 'Messenger') {
                res.redirect('/mHome');
            } else if (userData.role === 'Wealth Support') {
                res.redirect('/wsHome');
            } else if (userData.role === 'Sale') {
                res.redirect('/sHome');
            }
        } catch (error) {
            console.error(error);
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});


//Login
app.get('/login',loginController)
app.post('/user/login',loginUserFunction)

//Wealth Support
app.get('/wsHome',wealthsMiddleware,wsHomeController)
app.get('/search',wealthsMiddleware,searchController)
app.get('/form',wealthsMiddleware,formController)
app.post('/search/run',wealthsMiddleware,searchwsFunction)
app.post('/track/form',wealthsMiddleware,storeTrackFunction)
app.post('/form/cus/autofill',wealthsMiddleware,cusautofillFunction)
app.post('/form/disp/autofill',wealthsMiddleware,dispautofillFunction)

//Sale
app.get('/sHome',saleMiddleware,sHomeController)
app.get('/ssearch',saleMiddleware,ssearchController)
app.get('/sform',saleMiddleware,sformController)
app.post('/search/srun',saleMiddleware,searchsFunction)
app.post('/track/sform',saleMiddleware,sstoreTrackFunction)
app.post('/form/sale/cus/autofill',saleMiddleware,salecusautofillFunction)

//Messenger
app.get('/mHome',messMiddleware,mHomeController)
app.post('/mHome/edit',messMiddleware,editFunction)
app.post('/mHome/edit/failed',messMiddleware,editFailedFunction)

//Register
//app.get('/register',registerController)
//app.post('/user/register',storeUserFunction)
app.get('/logout',logoutController)

//Server
//const http = require('http');
//const hostname = 'wealth-han-tracker';
//const hostname = '192.168.105.54';

let port = process.env.PORT || 3000;
module.exports = { port };

//app.listen(port, () => {
//        console.log(`Server running at http://${hostname}:${port}`)
//});

app.listen(port,() => {
    console.log(`Server running at http://${port}`)
})