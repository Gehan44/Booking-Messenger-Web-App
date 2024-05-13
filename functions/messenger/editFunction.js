const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');

const sql = require('mssql');
const config = require('../../sqlConfig');
const runDetect = require('../emailFunction');
const { taskStop } = require('../taskService');

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

    if (variantStatus === "Created") {
      variantStatus = "Picked";
      //pickedDateTime
      pickedDateTime = moment().format('YYYY-MM-DD HH:mm')
      await request.query(`UPDATE tracks SET status = '${variantStatus}', userIDSend = '${UserID}', userNameSend = '${Username}', pickedDateTime = '${pickedDateTime}' WHERE docID = '${editTerm}'`);
    // && UserID === variantOwner
    } else if (variantStatus === "Picked" || variantStatus === "Incomplete") {
      const variantSendReturn = variant.docSendReturn;
      
      if (variantSendReturn === "ส่ง") {
        variantStatus = "Done";
        successDateTime = moment().format('YYYY-MM-DD HH:mm')
        await request.query(`UPDATE tracks SET status = '${variantStatus}', userIDSend = '${UserID}', userNameSend = '${Username}', successDateTime = '${successDateTime}' WHERE docID = '${editTerm}'`);
        const updatedVariantResult = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);
        const updatedVariant = updatedVariantResult.recordset[0];
        
        taskStop(editTerm)
        await runDetect(updatedVariant);
        //res.render('mSign', { editTerm });
        //redirectTriggered = true;
      } 
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