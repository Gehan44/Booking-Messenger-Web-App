module.exports = (req, res) => {
    const UserData = req.session.user;
    let requestDate = ""
    let docRound = ""
    let docTime = ""
    let docSendReturn = ""
    let docType = ""
    let docIs = ""
    let messenger = ""
    let cusName = ""
    let cusPlace = ""
    let cusTel = ""
    let dispName = ""
    let dispTel = ""
    let dispEmail = ""
    let dispNote = ""
    let data = req.flash('data')[0]
    
    if (typeof data != "undefined") {
        requestDate = data.requestDate
        docRound = data.docRound
        docTime = data.docTime
        docSendReturn = data.docSendReturn
        docType = data.docType
        docIs = data.docIs
        messenger = data.messenger
        cusName = data.cusName
        cusPlace = data.cusPlace
        cusTel = data.cusTel
        dispName = data.dispName
        dispTel = data.dispTel
        dispEmail = data.dispEmail
        dispNote = data.dispNote
        }
    res.render('form', { 
        UserData,
        requestDate: requestDate,
        docRound: docRound,
        docTime: docTime,
        docSendReturn: docSendReturn,
        docType: docType,
        docIs: docIs,
        messenger: messenger,
        cusName: cusName,
        cusPlace: cusPlace,
        cusTel: cusTel,
        dispName: dispName,
        dispTel: dispTel,
        dispEmail: dispEmail,
        dispNote: dispNote,
        errors: req.flash('validationErrors')
    });
};