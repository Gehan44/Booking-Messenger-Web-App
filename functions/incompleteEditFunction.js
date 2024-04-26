const sql = require('mssql');
const config = require('../sqlConfig');
const runDetect = require('./emailFunction');
const { taskStop,taskStart } = require('./taskService');

module.exports = async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const editTerm = req.body.updatedEditTerm;
        const dateTerm = req.body.noteEditTerm;
        await request.query(`UPDATE tracks SET status = 'Incomplete', requestDate = '${dateTerm}' WHERE docID = '${editTerm}'`);
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