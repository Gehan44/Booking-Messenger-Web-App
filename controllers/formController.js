module.exports = async (req, res) => {
    const UserData = req.session.user;
    try {
        let userIDCreated = UserData.userID
        let requestDate = ""
        let docRound = ""
        let docTime = ""
        let docSendReturn = ""
        let docType = ""
        let docIs = ""
        let cusName = ""
        let cusPlace = ""
        let cusTel = ""
        let dispName = ""
        let dispTel = ""
        let dispEmail = ""
        let dispNote = ""
        let data = req.flash('data')[0]

        if (typeof data != "undefined") {
            userIDCreated = data.userIDCreated
            requestDate = data.requestDate
            docRound = data.docRound
            docTime = data.docTime
            docSendReturn = data.docSendReturn
            docType = data.docType
            docIs = data.docIs
            cusName = data.cusName
            cusPlace = data.cusPlace
            cusTel = data.cusTel
            dispName = data.dispName
            dispTel = data.dispTel
            dispEmail = data.dispEmail
            dispNote = data.dispNote
        }
        res.render('form', { UserData,
            errors: req.flash('validationErrors'),
            userIDCreated: userIDCreated,
            requestDate: requestDate,
            docRound: docRound,
            docTime: docTime,
            docSendReturn: docSendReturn,
            docType: docType,
            docIs: docIs,
            cusName: cusName,
            cusPlace: cusPlace,
            cusTel: cusTel,
            dispName: dispName,
            dispTel: dispTel,
            dispEmail: dispEmail,
            dispNote: dispNote
        })
    } catch (error) {
        console.error("Error:", error);
    }
}