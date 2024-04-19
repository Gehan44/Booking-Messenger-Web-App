const sql = require('mssql');
const sqlConfig = require('../sqlConfig');
const qr = require('qr-image');

module.exports = async function runDetails(req,res) {
  const {detailsTerm} = req.body;
  const UserData = req.session.user;
  try {
    if (!detailsTerm) {
      throw new Error('กรุณากรอกข้อมูล')
    }

    const pool = await sql.connect(sqlConfig);
    let query = `SELECT * FROM tracks WHERE docID = '${detailsTerm}'`;

    if (UserData.role === "Sale") {
      query += ` AND dispEmail = '${UserData.email}'`;
    }
    const result = await pool.request().query(query)
    
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
    return res.redirect('/')

  } finally {
    await sql.close();
  }
};