const sql = require('mssql');
const config = require('../sqlConfig');
const qr = require('qr-image');

module.exports = async function runDetails(req,res) {
  const {detailsTerm} = req.body;
  try {
    await sql.connect(config);
    const request = new sql.Request();
    
    if (!detailsTerm) {
      throw new Error('กรุณากรอกข้อมูล')
    }

    const result = await request.query(`SELECT * FROM tracks WHERE docID = '${detailsTerm}'`);
    if (result.recordset.length === 0) {
      throw new Error('กรุณากรอกข้อมูลให้ถูกต้อง')
    }

    const createdTrack =  result.recordset[0];
    const createdTrackStatus = createdTrack.status
    
    if (createdTrackStatus != "Created") {
      throw new Error('ไม่ใช่สถานะ Created')
    }

    const docQR = createdTrack.docQR
    const docQRCode = qr.imageSync(docQR, { type: 'png', size: 4 });
    res.render('print', { createdTrack, docQRCode });

  } catch (error) {
    return res.redirect('/wsHome')

  } finally {
    await sql.close();
  }
};