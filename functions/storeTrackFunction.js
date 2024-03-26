const createTrack = require('../models/track');
const { taskStart } = require('./taskService');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');

module.exports = async (req, res) => {
    const userData = req.session.user;
    const { requestDate, docRound, docTime, docSendReturn, docType, docIs, docFnote, cusName, cusPlace, cusTel, dispName, dispTel, dispEmail, dispNote } = req.body;
    try {
        const createdDate = moment().format('YYYY-MM-DD');
        const createdTime = moment().format('HH:mm');

        if (createdDate === requestDate) {
            if (moment(docTime, 'HH:mm').isBefore(moment(createdTime, 'HH:mm'))) {
                throw new Error('สดวกเวลานั้นช้ากว่าปัจจุบัน');
            } else if (moment('13:30', 'HH:mm').isBefore(moment(createdTime, 'HH:mm'))) {
                throw new Error('วันที่นัดไม่ทันส่งวันนี้แล้ว');
            }
        }

        const parsedTime = parseInt(docTime.split(':')[0]);
        if (docRound === "รอบเช้า") {
            if (parsedTime >= 13 && parsedTime <= 18) {
                throw new Error('กรุณากรอกเวลาให้ถูกต้อง');
            }
        } else if (docRound === "รอบบ่าย") {
            if (parsedTime >= 8 && parsedTime <= 13) {
                throw new Error('กรุณากรอกเวลาให้ถูกต้อง');
            }
        }
        
        const protocol = req.protocol;
        const hostname = req.headers.host;
        const { createdTrack, docQRCode } = await createTrack(userData,req.body,protocol,hostname);
        taskStart(createdTrack, createdTrack.requestDate);
        res.render('print', { createdTrack, docQRCode });  

    } catch (error) {
        req.flash('data', req.body);
        req.flash('validationErrors', error.message);
        return res.redirect('/form');
    }
};
