const createTrack = require('../models/track');
const { taskStart } = require('./taskService');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');

module.exports = async (req, res) => {
    const userData = req.session.user;
    const { requestDate, docRound, docTime, docSendReturn, docType, docIs, docFnote, cusName, cusPlace, cusTel, dispTel, dispNote } = req.body;
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

        //For prevent delay
        const currentDate = new Date();
        const requestDateMilliseconds = new Date(requestDate).getTime();
        const differenceInMilliseconds =  requestDateMilliseconds - currentDate;
        const twentyThreeDaysMilliseconds = 23 * 24 * 60 * 60 * 1000;
        console.log(differenceInMilliseconds)
        console.log(twentyThreeDaysMilliseconds)
        if (differenceInMilliseconds > twentyThreeDaysMilliseconds) {
            throw new Error('The difference between Date.now() and requestDate exceeds 23 days');
        }

        if (docRound === "รอบเช้า") {
            if (moment(docTime,'HH:mm').isAfter(moment('13:00','HH:mm'))) {
                throw new Error('กรุณากรอกเวลาให้ถูกต้อง');
            }
        } else if (docRound === "รอบบ่าย") {
            if (moment(docTime,'HH:mm').isBefore(moment('13:00','HH:mm'))) {
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