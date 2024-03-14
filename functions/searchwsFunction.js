const sql = require('mssql');
const config = require('../sqlConfig');

module.exports = async (req, res) => {
    try {
        const UserData = req.session.user;
        let {searchTerm,searchFilter} = req.body;

        if (!searchFilter) {
            let searchResults = null;
            res.render('search', { UserData, searchTerm, searchFilter, searchResults});
            return
        }

        if (searchFilter === 'createdDate') {
            searchFilter = 'createdDateTime';
        }
        
        await sql.connect(config);
        const request = new sql.Request();

        let query;
        if (searchFilter === 'docTime') {
            query = `SELECT * FROM tracks WHERE CONVERT(TIME, ${searchFilter}) = CONVERT(TIME, '${searchTerm}')`;
        } else if (searchFilter === 'createdDateTime' || searchFilter === 'requestDate') {
            query = `SELECT * FROM tracks WHERE CONVERT(VARCHAR, ${searchFilter}, 120) LIKE '%${searchTerm}%'`;
        } else {
            query = `SELECT * FROM tracks WHERE CONVERT(TEXT, ${searchFilter}) LIKE '%${searchTerm}%'`;
        }
        query += ` ORDER BY docID DESC`;

        const result = await request.query(query);
        const searchResults = result.recordset;
        res.render('search', { UserData, searchTerm, searchResults, searchFilter });

    } catch (error) {
        req.flash('data', req.body);
        req.flash('validationErrors', error.message);
        return res.redirect('/search')

    } finally {
        await sql.close();
    }
};