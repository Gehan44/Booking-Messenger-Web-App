const sql = require('mssql');
const config = require('../../sqlConfig');

module.exports = async function runDetect(_updatedEditTerm) {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const editTerm = _updatedEditTerm;
    if (!editTerm) {
      console.log("Input term is undefined or empty");
      return { VariantData: false };
    }
    const result = await request.query(`SELECT * FROM tracks WHERE docID = '${editTerm}'`);

    if (result.recordset.length === 0) {
      return { VariantData: false };
    }
    return result.recordset[0];

  } catch (error) {
    req.flash('validationErrors', error.message);

  } finally {
    await sql.close();
  }
};