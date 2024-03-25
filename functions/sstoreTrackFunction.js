const createTrack = require('../models/track');
const { taskStart } = require('./taskService');

module.exports = async (req, res) => {
    const userData = req.session.user;
    const { requestDate, docRound, docTime, docSendReturn, docType, docIs, docFnote, cusName, cusPlace, cusTel, dispTel, dispNote } = req.body;
    try {

        const parsedTime = parseInt(docTime.split(':')[0]);
        if (docRound === "รอบบ่าย") {
            if (parsedTime >= 8 && parsedTime < 13) {
                throw new Error('กรุณากรอกเวลาให้ถูกต้อง');
            }
        }

        const protocol = req.protocol;
        const hostname = req.headers.host;
        const { createdTrack, docQRCode } = await createTrack(userData,req.body,protocol,hostname);
        taskStart(createdTrack, createdTrack.requestDate);
        res.render('sprint', { createdTrack, docQRCode });        
    } catch (error) {
        req.flash('data', req.body);
        req.flash('validationErrors', error.message);
        return res.redirect('/sform')
    }
};