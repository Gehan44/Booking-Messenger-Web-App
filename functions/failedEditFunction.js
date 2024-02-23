const sql = require('mssql');
const config = require('../sqlConfig');
//const runDetect = require('./emailFunction');

module.exports = async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();

        const editTerm = req.body.updatedEditTerm;
        const noteTerm = req.body.noteEditTerm;
        const Username = req.session.user.name;

        const result = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);

        if (result.recordset.length === 0) {
            console.log(`Variant with docID ${editTerm} not found`);
            return;
        } else {
            variantStatus = "Failed";
            const combinedNote = `${noteTerm}, แจ้งโดย ${Username}`;
            console.log(combinedNote)
            await request.query(`UPDATE tracks SET status = '${variantStatus}', docFnote = '${combinedNote}' WHERE docID = '${editTerm}'`);
        }

        console.log("Update to status failed");
        res.redirect('/mHome');
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sql.close();
    }
}
