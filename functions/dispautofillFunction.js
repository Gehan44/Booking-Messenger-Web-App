const sql = require('mssql');
const config = require('../sqlConfig');

const autofillFunction = async (req, res) => {
    try {
      const dispName = req.body.dispName;
      if (dispName === "" || dispName === " ") {
        throw new Error('Empty')
      }
      await sql.connect(config);
      const request = new sql.Request();
      query = `SELECT TOP 1 * FROM tracks WHERE CONVERT(TEXT, dispName) LIKE '%${dispName}%' ORDER BY createdDateTime DESC;`;
      const result = await request.query(query);
      const firstRecord = result.recordset[0];
      const dispTel = firstRecord.dispTel;
      const dispEmail = firstRecord.dispEmail;
      const autofillData = {
          dispTel: dispTel,
          dispEmail: dispEmail
      };
      res.json(autofillData);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
};

module.exports = autofillFunction;