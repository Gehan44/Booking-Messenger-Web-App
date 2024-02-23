const sql = require('mssql');
const config = require('../sqlConfig');
//const runDetect = require('./emailFunction');

module.exports = async (req, res) => {
  try {
    await sql.connect(config);

    const request = new sql.Request();
    const editTerm = req.body.updatedEditTerm;
    const UserID = req.session.user.userID;
    const Username = req.session.user.name;

    const result = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);

    if (result.recordset.length === 0) {
      console.log(`Variant with docID ${editTerm} not found`);
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
        await request.query(`UPDATE tracks SET status = '${variantStatus}' WHERE docID = '${editTerm}'`);
        //runDetect(variantEmail, variant);
      } else if (variantSendReturn === "รับ") {
        variantStatus = "Returned";
        await request.query(`UPDATE tracks SET status = '${variantStatus}' WHERE docID = '${editTerm}'`);
        //runDetect(variantEmail, variant);
      }

    } else if (variantStatus === "Picked") {
      console.log("Sorry, you are not allowed.");
    } else {
      console.log("Unknown variant status:", variantStatus);
    }

    console.log("Update Success");
    res.redirect('/mHome');
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sql.close();
  }
}
