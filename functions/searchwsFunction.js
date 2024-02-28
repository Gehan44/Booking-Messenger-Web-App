const sql = require('mssql');
const config = require('../sqlConfig');

module.exports = async (req, res) => {
    try {
        const UserData = req.session.user;
        let searchTerm = req.body.searchTerm;
        let searchFilter = req.body.searchFilter;

        if (searchFilter === 'createdDate') {
            searchFilter = 'createdDateTime';
        }
        
        if (searchFilter === 'createdDateTime' || searchFilter === 'requestDate') {
            searchTerm = searchTerm.replace('T', ' ');
        }
        await sql.connect(config);
        const request = new sql.Request();

        let query;
        if (searchFilter === 'docTime') {
            query = `SELECT * FROM tracks WHERE CONVERT(TIME, ${searchFilter}) = CONVERT(TIME, '${searchTerm}')`;
        } else {
            query = `SELECT * FROM tracks WHERE CONVERT(VARCHAR, ${searchFilter}, 120) LIKE '%${searchTerm}%'`;
        }

        const result = await request.query(query);
        const searchResults = result.recordset;

        res.render('search', { UserData, searchTerm, searchResults, searchFilter });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await sql.close();
    }
};