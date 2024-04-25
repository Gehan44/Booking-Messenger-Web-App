const express = require('express')
const cors = require("cors")
const app = express()
const ejs = require('ejs')
const session  = require('express-session')
const MemoryStore = require('memorystore')(session)
const flash = require('connect-flash')

//Page Control
const loginController = require('./controllers/loginController.js')
const logoutController = require('./controllers/logoutController.js')
const registerController = require('./controllers/registerController.js')
const wsHomeController = require('./controllers/wsHomeController.js')
const manageController = require('./controllers/manageController.js')
const searchController = require('./controllers/searchController.js')
const formController = require('./controllers/formController.js')
const forgotController = require('./controllers/forgotController.js')
const sHomeController = require('./controllers/sHomeController.js')
const ssearchController = require('./controllers/ssearchController.js')
const sformController = require('./controllers/sformController.js')
const mHomeController = require('./controllers/mHomeController.js')
const mSummaryController = require('./controllers/mSummaryController.js')

//Function
const loginUserFunction = require('./functions/loginUserFunction.js')
const searchwsFunction = require('./functions/searchwsFunction.js')
const searchsFunction = require('./functions/searchsFunction.js')
const storeTrackFunction = require('./functions/storeTrackFunction.js')
const storeUserFunction = require('./functions/storeUserFunction.js')
const editFunction = require('./functions/editFunction')
const editIncompleteFunction = require('./functions/incompleteEditFunction.js')
const editFailedFunction = require('./functions/failedEditFunction')
const cusautofillFunction = require('./functions/cusautofillFunction.js')
const dispautofillFunction = require('./functions/dispautofillFunction.js')
const salecusautofillFunction = require('./functions/scusautofillFunction.js')
const forgotFunction = require('./functions/forgotFunction.js')
const detailsFunction = require('./functions/detailsFunction.js')
const manageFunction = require('./functions/editwsFunction.js')
const storeSignFunction = require('./functions/storeSignFunction.js')

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
    secret: 'keyboard bird',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: hours * 60 * 60 * 1000  
    },
    store: new MemoryStore({
        checkPeriod: 86400000
    })
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
app.get('/login',redirectIfAuth,loginController)
app.post('/user/login',redirectIfAuth,loginUserFunction)
app.get('/logout',logoutController)

//Wealth Support
app.get('/wsHome',wealthsMiddleware,wsHomeController)
app.get('/manage',wealthsMiddleware,manageController)
app.post('/manage/action',wealthsMiddleware,manageFunction)
app.get('/search',wealthsMiddleware,searchController)
app.post('/search/run',wealthsMiddleware,searchwsFunction)
app.get('/form',wealthsMiddleware,formController)
app.post('/form/cus/autofill',wealthsMiddleware,cusautofillFunction)
app.post('/form/disp/autofill',wealthsMiddleware,dispautofillFunction)
app.post('/form/store',wealthsMiddleware,storeTrackFunction)
app.get('/forgot',wealthsMiddleware,forgotController)
app.post('/search/print',wealthsMiddleware,forgotFunction)

//Sale
app.get('/sHome',saleMiddleware,sHomeController)
app.post('/sHome/details',saleMiddleware,detailsFunction)
app.get('/ssearch',saleMiddleware,ssearchController)
app.post('/ssearch/run',saleMiddleware,searchsFunction)
app.get('/sform',saleMiddleware,sformController)
app.post('/form/sale/cus/autofill',saleMiddleware,salecusautofillFunction)
app.post('/sform/store',saleMiddleware,storeTrackFunction)

//Messenger
app.get('/mHome',messMiddleware,mHomeController)
app.get('/mHome/summary',messMiddleware,mSummaryController)
app.post('/mHome/edit',messMiddleware,editFunction)
app.post('/sign/store',messMiddleware,storeSignFunction)
app.post('/mHome/edit/incomplete',messMiddleware,editIncompleteFunction)
app.post('/mHome/edit/failed',messMiddleware,editFailedFunction)

//Register
app.get('/register',registerController)
app.post('/user/register',storeUserFunction)

//Admin
const testerController = require('./controllers/testerController.js')
app.get('/han/test',testerController)


let port = process.env.PORT || 3000;
module.exports = { port };

app.listen(port,() => {
    console.log(`Server running at http://${port}`)
})

//Simulator Server
//const http = require('http');
//const hostname = '192.168.105.54';
//app.listen(port, () => {
//        console.log(`Server running at http://${hostname}:${port}`)
//});

process.on('warning', (warning) => {
    //console.log(warning.stack);
});