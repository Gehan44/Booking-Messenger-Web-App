const sql = require('mssql');
const config = require('../sqlConfig');

const autofillFunction = async (req, res) => {
    try {
      const cusName = req.body.cusName;
      await sql.connect(config);
      const request = new sql.Request();
      query = `SELECT TOP 1 * FROM tracks WHERE CONVERT(TEXT, cusName) LIKE '%${cusName}%' ORDER BY createdDateTime DESC;`;
      const result = await request.query(query);
      const firstRecord = result.recordset[0];
      const cusPlace = firstRecord.cusPlace;
      const cusTel = firstRecord.cusTel;
      const autofillData = {
          cusPlace: cusPlace,
          cusTel: cusTel
      };
      res.json(autofillData);
    } catch (error) {
      console.error('Error during autofill:', error);
      res.status(500).send('Internal Server Error');
    }
};

module.exports = autofillFunction;