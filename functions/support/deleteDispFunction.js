const sql = require('mssql');
const sqlConfig = require('../../sqlConfig');

const deleteDispFunction = async (req, res) => {
    const dispID = req.body.dispID;
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();

        const query = `
            DELETE FROM [dbo].[customers] WHERE dispID = @dispID
        `;

        const result = await request.input('dispID', sql.Int, dispID)
                                      .query(query);

        sql.close();
        res.status(200).send('Customer deleted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = deleteDispFunction;