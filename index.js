const express = require('express')
const cors = require("cors")
const app = express()
const ejs = require('ejs')
const session  = require('express-session')
const MemoryStore = require('memorystore')(session)
const flash = require('connect-flash')

//Page Control
//System
const loginController = require('./controllers/loginController.js')
const logoutController = require('./controllers/logoutController.js')
//Admin
const registerController = require('./controllers/admin/registerController.js')
const testerController = require('./controllers/admin/testerController.js')
//Messenger
const mHomeController = require('./controllers/messenger/mHomeController.js')
const mSummaryController = require('./controllers/messenger/mSummaryController.js')
//Support
const sHomeController = require('./controllers/support/sHomeController.js')
const sManageController = require('./controllers/support/sManageController.js')
const sSearchController = require('./controllers/support/sSearchController.js')
const sFormController = require('./controllers/support/sFormController.js')
const sMultiPrintController = require('./controllers/support/sMultiPrintController.js')
//User
const uHomeController = require('./controllers/user/uHomeController.js')
const uSearchController = require('./controllers/user/uSearchController.js')
const uFormController = require('./controllers/user/uFormController.js')

//Function
//System
const loginUserFunction = require('./functions/loginUserFunction.js')
const storeTrackFunction = require('./functions/storeTrackFunction.js')
const addCusFunction = require('./functions/addCusFunction.js')
const searchCusFunction = require('./functions/searchCusFunction.js')
const deleteCusFunction = require('./functions/deleteCusFunction.js')
//Admin
const storeUserFunction = require('./functions/storeUserFunction.js')
//Messenger
const mEditFunction = require('./functions/messenger/editFunction.js')
const mEditIncompleteFunction = require('./functions/messenger/incompleteEditFunction.js')
const mEditFailedFunction = require('./functions/messenger/failedEditFunction.js')
const mStoreSignFunction = require('./functions/messenger/storeSignFunction.js')
//Support
const sMultiPrintFunction = require('./functions/support/sMultiPrintFunction.js')
const sManageFunction = require('./functions/support/sEditFunction.js')
const sSearchFunction = require('./functions/support/sSearchFunction.js')

const addDispFunction = require('./functions/support/addDispFunction.js')
const searchDispFunction = require('./functions/support/searchDispFunction.js')
const deleteDispFunction = require('./functions/support/deleteDispFunction.js')
//User
const uDetailsFunction = require('./functions/user/uDetailsFunction.js')
const uSearchFunction = require('./functions/user/uSearchFunction.js')
const uCusautofillFunction = require('./functions/user/uCusautofillFunction.js')

//Middleware
const redirectIfAuth = require('./middleware/redirectifAuth')
const supportMiddleware = require('./middleware/supportMiddleware.js')
const messMiddleware = require('./middleware/messMiddleware.js')
const userMiddleware = require('./middleware/userMiddleware.js')
const adminMiddleware = require('./middleware/adminMiddleware.js')

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
            } else if (userData.role === 'Support') {
                res.redirect('/sHome');
            } else if (userData.role === 'User') {
                res.redirect('/uHome');
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

//Messenger
app.get('/mHome',messMiddleware,mHomeController)
app.get('/mHome/summary',messMiddleware,mSummaryController)
app.post('/mHome/edit',messMiddleware,mEditFunction)
app.post('/sign/store',messMiddleware,mStoreSignFunction)
app.post('/mHome/edit/incomplete',messMiddleware,mEditIncompleteFunction)
app.post('/mHome/edit/failed',messMiddleware,mEditFailedFunction)

//Support
app.get('/sHome',supportMiddleware,sHomeController)
app.get('/sManage',supportMiddleware,sManageController)
app.post('/sManage/action',supportMiddleware,sManageFunction)
app.get('/sSearch',supportMiddleware,sSearchController)
app.post('/sSearch/run',supportMiddleware,sSearchFunction)
app.get('/sForm',supportMiddleware,sFormController)

app.post('/sForm/cus/add',supportMiddleware,addCusFunction)
app.post('/sForm/cus/search',supportMiddleware,searchCusFunction)
app.post('/sForm/cus/delete',supportMiddleware,deleteCusFunction)

app.post('/sForm/disp/add',supportMiddleware,addDispFunction)
app.post('/sForm/disp/search',supportMiddleware,searchDispFunction)
app.post('/sForm/disp/delete',supportMiddleware,deleteDispFunction)

app.post('/sForm/store',supportMiddleware,storeTrackFunction)
app.get('/sMulti',supportMiddleware,sMultiPrintController)
app.post('/sMulti/print',supportMiddleware,sMultiPrintFunction)

//User
app.get('/uHome',userMiddleware,uHomeController)
app.post('/uHome/details',userMiddleware,uDetailsFunction)
app.get('/uSearch',userMiddleware,uSearchController)
app.post('/uSearch/run',userMiddleware,uSearchFunction)
app.get('/uForm',userMiddleware,uFormController)

app.post('/uForm/cus/add',userMiddleware,addCusFunction)
app.post('/uForm/cus/search',userMiddleware,searchCusFunction)
app.post('/uForm/cus/delete',userMiddleware,deleteCusFunction)

app.post('/uForm/store',userMiddleware,storeTrackFunction)

//Admin
app.get('/register',registerController)
app.post('/user/register',storeUserFunction)
app.get('/test/memory',testerController)

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