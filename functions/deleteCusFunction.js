const sql = require('mssql');
const sqlConfig = require('../sqlConfig');

const deleteCusFunction = async (req, res) => {
    const cusID = req.body.cusID;
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();

        const query = `
            DELETE FROM [dbo].[customers] WHERE cusID = @cusID
        `;

        const result = await request.input('cusID', sql.Int, cusID)
                                      .query(query);

        sql.close();
        res.status(200).send('Customer deleted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = deleteCusFunction;