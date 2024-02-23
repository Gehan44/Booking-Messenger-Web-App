const sql = require('mssql');
const sqlConfig = require('../sqlConfig')

module.exports = async (req, res) => {
    let UserData = req.session.user;
    let userIDCreated = UserData.userID
    let userEmail = ""
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
        .input('userIDCreated', sql.Int, userIDCreated)
        .query('SELECT email FROM dbo.users WHERE userID = @userIDCreated');
    if (result.recordset.length > 0) {
        userEmail = result.recordset[0].email;
        console.log(userEmail)
    }
    try {
        let userName = UserData.name
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
            userName = data.userName
            userEmail = data.userEmail
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
        res.render('sform', {
            UserData,
            errors: req.flash('validationErrors'),
            userIDCreated: userIDCreated,
            userName: userName,
            userEmail: userEmail,
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
        });
    } catch (error) {
        console.error("Error:", error);
    }
};