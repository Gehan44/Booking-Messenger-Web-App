const sql = require('mssql');
const config = require('../../sqlConfig');
const qr = require('qr-image');

module.exports = async function runDetect(req, res) {
  let searchTerm = req.body.searchTerm;

  if (!Array.isArray(searchTerm)) {
    searchTerm = [searchTerm];
  }

  try {
    const validSearchTerms = searchTerm.filter(term => typeof term !== 'undefined');
    if (validSearchTerms.length === 0) {
        throw new Error('กรุณากดเลือก');
    }

    if (validSearchTerms.length >= 4) {
        throw new Error('ห้ามเลือกมากกว่า 3');
    }

    await sql.connect(config);
    const request = new sql.Request();

    const query = `SELECT * FROM tracks WHERE docID IN ('${searchTerm.join("', '")}')`;
    const result = await request.query(query);

    const createdTracks = result.recordset;
    const createdTrackStatuses = createdTracks.map(track => track.status);

    const allCreated = createdTrackStatuses.every(status => status === 'Created');

    if (!allCreated) {
      throw new Error('ไม่ใช่สถานะ Created');
    }

    createdTracks.forEach(track => {
      if (track.docQR) {
        const qrImage = qr.imageSync(track.docQR, { type: 'png', size: 4 });
        track.qrImageData = qrImage.toString('base64');
      }
    });

    res.render('prints', { createdTracks });

  } catch (error) {
    req.flash('data', req.body);
    req.flash('validationErrors', error.message);
    return res.redirect('/sMulti');

  } finally {
    await sql.close();
  }
};
