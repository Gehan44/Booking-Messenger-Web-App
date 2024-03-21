const createTrack = require('../models/track');
const { taskStart } = require('./taskService');

module.exports = async (req, res) => {
    const userData = req.session.user;
    const { requestDate, docRound, docTime, docSendReturn, docType, docIs, docFnote, cusName, cusPlace, cusTel, dispTel, dispNote } = req.body;
    try {
        const protocol = req.protocol;
        const hostname = req.headers.host;
        const { createdTrack, docQRCode } = await createTrack(userData,req.body,protocol,hostname);
        taskStart(createdTrack, createdTrack.requestDate);
        res.render('sprint', { createdTrack, docQRCode });        
    } catch (error) {
        console.error(error);
        if (error) {
            const validationErrors = [error.message];
            req.flash('validationErrors', validationErrors);
            req.flash('data', req.body);
        }
        res.redirect('sHome');
    }
};