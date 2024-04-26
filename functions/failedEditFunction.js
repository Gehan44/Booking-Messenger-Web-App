const sql = require('mssql');
const config = require('../sqlConfig');
const runDetect = require('./emailFunction');
const { taskStop } = require('./taskService');

module.exports = async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const editTerm = req.body.updatedEditTerm;
        const noteTerm = req.body.noteEditTerm;
        const UserID = req.session.user.userID;
        const Username = req.session.user.name;
        const result = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);
        const variant = result.recordset[0];
        const combinedNote = `${noteTerm}, แจ้งโดย ${Username}`;

        if (variant.userIDSend === null && variant.userNameSend === null) {
            await request.query(`UPDATE tracks SET userIDSend = '${UserID}', userNameSend = '${Username}' WHERE docID = '${editTerm}'`);
        }

        await request.query(`UPDATE tracks SET status = 'Failed', docNote = '${combinedNote}' WHERE docID = '${editTerm}'`);
        const updatedVariantResult = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);
        const updatedVariant = updatedVariantResult.recordset[0];

        taskStop(editTerm)
        //await runDetect(updatedVariant);
        res.redirect('/mHome');
        
    } catch (error) {
        console.error("Error:", error);

    } finally {
        await sql.close();
    }
}