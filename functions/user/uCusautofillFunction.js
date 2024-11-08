const sql = require('mssql');
const config = require('../../sqlConfig');

const autofillFunction = async (req, res) => {
    try {
      const UserData = req.session.user;
      const cusName = req.body.cusName;
      if (cusName === "" || cusName === " ") {
        throw new Error('Empty')
      }
      const pool = await sql.connect(config);
      let query = `SELECT TOP 1 * FROM tracks WHERE CONVERT(TEXT, cusName) LIKE '%${cusName}%'`;
      query += ` AND dispEmail = '${UserData.email}'`;
      query += ` ORDER BY createdDateTime DESC;`;
      const result = await pool.request().query(query);
      const firstRecord = result.recordset[0];
      const cusPlace = firstRecord.cusPlace;
      const cusTel = firstRecord.cusTel;
      const autofillData = {
          cusPlace: cusPlace,
          cusTel: cusTel
      };
      res.json(autofillData);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
};

module.exports = autofillFunction;