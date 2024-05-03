const sql = require('mssql');
const config = require('../sqlConfig');
const runDetect = require('./emailFunction');
const { taskStop } = require('./taskService');

module.exports = async (req, res) => {
  let redirectTriggered = false;
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const editTerm = req.body.updatedEditTerm;
    const UserID = req.session.user.userID;
    const Username = req.session.user.name;
    const result = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);

    const variant = result.recordset[0];
    let variantStatus = variant.status;
    const variantOwner = variant.userIDSend;

    if (variantStatus === "Created" || variantStatus === "Incomplete") {
      const variantSendReturn = variant.docSendReturn;

      if (variantSendReturn === "ส่ง") {
        variantStatus = "Done";

      } else if (variantSendReturn === "รับ" || variantSendReturn === "ส่งรอรับกลับ") {
        variantStatus = "Returned";
      }

      await request.query(`UPDATE tracks SET status = '${variantStatus}', userIDSend = '${UserID}', userNameSend = '${Username}' WHERE docID = '${editTerm}'`);
      const updatedVariantResult = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);
      const updatedVariant = updatedVariantResult.recordset[0];
      
      taskStop(editTerm)
      await runDetect(updatedVariant);
      res.render('sign', { editTerm });
      redirectTriggered = true;
    }

    if (!redirectTriggered) {
      res.redirect('/mHome');
    }

  } catch (error) {
    console.error("Error:", error);
    
  } finally {
    await sql.close();
  }
}