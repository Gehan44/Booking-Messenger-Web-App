const sql = require('mssql');
const config = require('../../sqlConfig');

const storeSignFunction = async (req, res) => {
    try {
      const editTerm = req.body.editTerm; 
      const signature = req.body.signature; 
      await sql.connect(config);
      const request = new sql.Request();
      await request.query(`UPDATE tracks SET sign = '${signature}' WHERE docID = '${editTerm}'`);
      res.status(200).send("Signature stored successfully.");

    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
};

module.exports = storeSignFunction;