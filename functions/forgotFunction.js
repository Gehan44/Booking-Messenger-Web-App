const sql = require('mssql');
const config = require('../sqlConfig');
const qr = require('qr-image');

module.exports = async function runDetect(req,res) {
  const {searchTerm} = req.body;
  try {
    await sql.connect(config);
    const request = new sql.Request();
    
    if (!searchTerm) {
      throw new Error('กรุณากรอกข้อมูล')
    }

    const result = await request.query(`SELECT * FROM tracks WHERE docID = '${searchTerm}'`);
    if (result.recordset.length === 0) {
      throw new Error('กรุณากรอกข้อมูลให้ถูกต้อง')
    }

    const createdTrack =  result.recordset[0];
    const createdTrackStatus = createdTrack.status
    
    if (createdTrackStatus != "Created") {
      throw new Error('ไม่ใช่สถานะ Created')
    }

    const docQR = createdTrack.docQR
    if (docQR) {
      const docQRCode = qr.imageSync(docQR, { type: 'png', size: 4 });
      res.render('print', { createdTrack, docQRCode });
    } else {
      const docQRCode = null
      res.render('print', { createdTrack, docQRCode });
    }

  } catch (error) {
    req.flash('data', req.body);
    req.flash('validationErrors', error.message);
    return res.redirect('/forgot')

  } finally {
    await sql.close();
  }
};