const sql = require('mssql');
const config = require('../sqlConfig');

module.exports = async (req, res) => {
    try {
        const UserData = req.session.user;
        let { searchTerm, searchFilter } = req.body;

        if (!searchFilter) {
            let searchResults = null;
            res.render('ssearch', { UserData, searchTerm, searchFilter, searchResults});
            return
        }

        if (searchFilter === 'createdDate') {
            searchFilter = 'createdDateTime';
        }

        await sql.connect(config);
        const request = new sql.Request();

        let query;
        if (searchFilter === 'all') {
            query = `SELECT TOP 200 * FROM tracks`;

        } else if (searchFilter === 'alldoneandreturned') {
            query = `SELECT * FROM tracks WHERE status IN ('Done', 'Returned')`;

        } else if (searchFilter === 'allfailed') {
            query = `SELECT * FROM tracks WHERE status IN ('Failed')`;

        } else if (searchFilter === 'docTime') {
            query = `SELECT * FROM tracks WHERE CONVERT(TIME, ${searchFilter}) = CONVERT(TIME, '${searchTerm}')`;

        } else if (searchFilter === 'createdDateTime' || searchFilter === 'requestDate') {
            query = `SELECT * FROM tracks WHERE CONVERT(VARCHAR, ${searchFilter}, 120) LIKE '%${searchTerm}%'`;

        } else {
            query = `SELECT * FROM tracks WHERE CONVERT(TEXT, ${searchFilter}) LIKE '%${searchTerm}%'`;
        }
        
        if (query.includes('WHERE')) {
            query += ` AND userIDCreated = '${UserData.userID}'`;
        } else {
            query += ` WHERE userIDCreated = '${UserData.userID}'`;
        }

        query += ` ORDER BY docID DESC`;
        const result = await request.query(query);
        const searchResults = result.recordset;
        res.render('ssearch', { UserData, searchTerm, searchResults, searchFilter });

    } catch (error) {
        req.flash('data', req.body);
        req.flash('validationErrors', error.message);
        return res.redirect('/ssearch');

    } finally {
        await sql.close();
    }
};