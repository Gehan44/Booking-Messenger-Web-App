const createTrack = require('../models/track');
const { taskStart } = require('./taskService');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');

module.exports = async (req, res) => {
    const userData = req.session.user;
    const { requestDate } = req.body;
    try {
        const createdDate = moment().format('YYYY-MM-DD');
        const createdTime = moment().format('HH:mm');

        //Prevent Sameday
        if (createdDate === requestDate) {
            if (moment('16:00', 'HH:mm').isBefore(moment(createdTime, 'HH:mm'))) {
                throw new Error('วันที่นัดไม่ทันส่งวันนี้แล้ว');
            }
        }
        
        //Prevent Delay
        const currentDate = new Date();
        const requestDateMilliseconds = new Date(requestDate).getTime();
        const differenceInMilliseconds =  requestDateMilliseconds - currentDate;
        const twentyThreeDaysMilliseconds = 23 * 24 * 60 * 60 * 1000;
        if (differenceInMilliseconds > twentyThreeDaysMilliseconds) {
            throw new Error('ไม่สามารถกรอกวันที่นัดเกิน 23 วัน');
        }
        
        const hostname = req.headers.host;
        const { createdTrack, docQRCode } = await createTrack(userData,req.body,hostname);
        taskStart(createdTrack);
        res.render('print', { createdTrack, docQRCode });  

    } catch (error) {
        console.error(error)
        req.flash('data', req.body);
        req.flash('validationErrors', error.message);
        if (userData.role === "Wealth Support") {
            return res.redirect('/form');
        } else if (userData.role === "Sale") {
            return res.redirect('/sform');
        }
    }
};