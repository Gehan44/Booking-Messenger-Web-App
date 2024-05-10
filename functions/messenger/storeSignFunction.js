const sql = require('mssql');
const config = require('../../sqlConfig');

const storeSignFunction = async (req, res) => {
    try {
      const editTerm = req.body.editTerm; 
      const canvas = req.body.canvas; 
      if (canvas) {
        console.log("Found")
      }
      await sql.connect(config);
      const request = new sql.Request();
      await request.query(`UPDATE tracks SET sign = '${canvas}' WHERE docID = '${editTerm}'`);
      res.status(200).send("Signature stored successfully.");

    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
};

module.exports = storeSignFunction;