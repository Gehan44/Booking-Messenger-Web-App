const createTrack = require('../models/track');

module.exports = async (req, res) => {
    const { userIDCreated,requestDate, docRound, docTime, docSendReturn, docType, docIs, docFnote, cusName, cusPlace, cusTel, dispName, dispTel, dispEmail, dispNote } = req.body;
    try {
        const { createdTrack, docQRCode } = await createTrack(req.body);
        res.render('print', { createdTrack, docQRCode });        
    } catch (error) {
        console.error(error);
        if (error) {
            const validationErrors = [error.message];
            req.flash('validationErrors', validationErrors);
            req.flash('data', req.body);
        }
        res.redirect('Whome');
    }
};