const sql = require('mssql');
const config = require('../sqlConfig');

module.exports = async (req, res) => {
    try {
        const searchTerm = req.body.searchTerm;
        const searchFilter = req.body.searchFilter;

        await sql.connect(config);
        const request = new sql.Request();
        const result = await request.query(`SELECT * FROM tracks WHERE ${searchFilter} LIKE '%${searchTerm}%'`);
        const searchResults = result.recordset;

        res.render('search', { searchTerm, searchResults });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await sql.close();
    }
};
