const sql = require('mssql');
const config = require('../sqlConfig');

module.exports = async (req, res) => {
    try {
        const UserData = req.session.user;
        let { searchTerm, searchFilter } = req.body;
        
        if (!searchFilter) {
            let searchResults = null;
            res.render('search', { 
                UserData,
                searchFilter: searchFilter,
                searchTerm: searchTerm,
                searchResults: searchResults,
                errors: req.flash('validationErrors') });
            return;
        }

        let trueFilter = ""
        if (searchFilter === 'createdDate') {
            trueFilter = 'createdDateTime';
        } else {
            trueFilter = searchFilter
        }

        await sql.connect(config);
        const request = new sql.Request();
        let query;
        if (trueFilter === 'all') {
            query = `SELECT TOP 200 * FROM tracks`;

        } else if (trueFilter === 'alldoneandreturned') {
            query = `SELECT * FROM tracks WHERE status IN ('Done', 'Returned')`;

        } else if (trueFilter === 'allfailed') {
            query = `SELECT * FROM tracks WHERE status IN ('Failed')`;

        } else if (trueFilter === 'docTime') {
            query = `SELECT * FROM tracks WHERE CONVERT(TIME, ${trueFilter}) = CONVERT(TIME, '${searchTerm}')`;

        } else if (trueFilter === 'createdDateTime' || trueFilter === 'requestDate') {
            if (searchTerm.length > 10) {
                const [startDateString, endDateString] = searchTerm.split(' to ');
                const startDate = `${startDateString.trim()} 00:00:00.000`;
                const endDate = `${endDateString.trim()} 23:59:59.000`;
                query = `SELECT * FROM tracks WHERE ${trueFilter} BETWEEN '${startDate}' AND '${endDate}'`;
            } else {
                query = `SELECT * FROM tracks WHERE CONVERT(VARCHAR, ${trueFilter}, 120) LIKE '%${searchTerm}%'`;
            }
        } else {
            query = `SELECT * FROM tracks WHERE CONVERT(TEXT, ${trueFilter}) LIKE '%${searchTerm}%'`;
        }

        if (trueFilter === 'createdDateTime' || trueFilter === 'requestDate') {
            query += ` ORDER BY ${trueFilter} DESC`;
        } else {
            query += ` ORDER BY docID DESC`;
        }

        const result = await request.query(query);
        const searchResults = result.recordset;
        res.render('search', { 
            UserData,
            searchFilter: searchFilter,
            searchTerm: searchTerm,
            searchResults: searchResults,
            errors: req.flash('validationErrors') });

    } catch (error) {
        req.flash('data', req.body);
        req.flash('validationErrors', error.message);
        return res.redirect('/search');

    } finally {
        await sql.close();
    }
};