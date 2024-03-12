const sql = require('mssql');
const config = require('../sqlConfig');
const runDetect = require('./emailFunction');

module.exports = async (req, res) => {
  try {
    await sql.connect(config);

    const request = new sql.Request();
    const editTerm = req.body.updatedEditTerm;
    const UserID = req.session.user.userID;
    const Username = req.session.user.name;

    const result = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);

    if (result.recordset.length === 0) {
      return;
    }

    const variant = result.recordset[0];
    let variantStatus = variant.status;
    const variantOwner = variant.userIDSend;

    if (variantStatus === "Created") {
      variantStatus = "Picked";

      await request.query(`UPDATE tracks SET status = '${variantStatus}', userIDSend = '${UserID}', userNameSend = '${Username}' WHERE docID = '${editTerm}'`);
    } else if (variantStatus === "Picked" && UserID === variantOwner) {
      const variantSendReturn = variant.docSendReturn;
      const variantEmail = variant.dispEmail;

      if (variantSendReturn === "ส่ง") {
        variantStatus = "Done";
      } else if (variantSendReturn === "รับ" || variantSendReturn === "ส่งรอรับกลับ") {
        variantStatus = "Returned";
      }
      await request.query(`UPDATE tracks SET status = '${variantStatus}' WHERE docID = '${editTerm}'`);
      const updatedVariantResult = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);
      const updatedVariant = updatedVariantResult.recordset[0];
      await runDetect(updatedVariant,variantEmail);

    } else if (variantStatus === "Picked") {
      return;
    } else {
      return;
    }

    res.redirect('/mHome');
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sql.close();
  }
}