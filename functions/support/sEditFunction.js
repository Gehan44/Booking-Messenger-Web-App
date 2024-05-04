const sql = require('mssql');
const config = require('../../sqlConfig');
const runDetect = require('../emailFunction');
const { taskStop } = require('../taskService');

module.exports = async (req, res) => {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const searchTerm = req.body.searchTerm;
    const noteTerm = req.body.noteEditTerm;
    const Username = req.session.user.name;
    const button = req.body.clickedButton;
    const combinedNote = `${noteTerm}, แจ้งโดย ${Username}`;
    const result = await request.query(`SELECT * FROM tracks WHERE docID = '${searchTerm}'`);
    const variant = result.recordset[0];
    let variantStatus = variant.status;
    const variantSendReturn = variant.docSendReturn;

    if (button === "success") {
      if (variantSendReturn === "ส่ง") {
        variantStatus = "Done";
      } else if (variantSendReturn === "รับ" || variantSendReturn === "ส่งรอรับกลับ") {
        variantStatus = "Returned";
      }
      await request.query(`UPDATE tracks SET status = '${variantStatus}' WHERE docID = '${searchTerm}'`);

    } else if (button === "failure") {
      await request.query(`UPDATE tracks SET status = 'Failed', docNote = '${combinedNote}' WHERE docID = '${searchTerm}'`);
    }
    const updatedVariantResult = await request.query(`SELECT * FROM tracks WHERE docID = '${searchTerm}'`);
    const updatedVariant = updatedVariantResult.recordset[0];

    taskStop(searchTerm)
    await runDetect(updatedVariant);
    res.redirect('/sManage');

  } catch (error) {
    console.error("Error:", error);
    
  } finally {
    await sql.close();
  }
}