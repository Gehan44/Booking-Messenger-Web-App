const sql = require('mssql');
const config = require('../../sqlConfig');

module.exports = async (req, res) => {
    try {
        const UserData = req.session.user;
        let { searchTerm, searchFilter } = req.body;

        if (!searchFilter) {
            let searchResults = null;
            res.render('uSearch', { 
                UserData,
                searchFilter: searchFilter,
                searchTerm: searchTerm,
                searchResults: searchResults,
                count,
                errors: req.flash('validationErrors') });
            return
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
        if (searchFilter === 'all') {
            query = `SELECT TOP 200 * FROM tracks`;

        } else if (searchFilter === 'alldoneandreturned') {
            query = `SELECT * FROM tracks WHERE status IN ('Done', 'Returned')`;

        } else if (searchFilter === 'allfailed') {
            query = `SELECT * FROM tracks WHERE status IN ('Failed')`;

        } else if (searchFilter === 'createdDateTime' || searchFilter === 'requestDate') {
            if (searchTerm.length > 10) {
                const [startDateString, endDateString] = searchTerm.split(' to ');
                const startDate = `${startDateString.trim()} 00:00:00.000`;
                const endDate = `${endDateString.trim()} 23:59:59.000`;
                query = `SELECT * FROM tracks WHERE ${searchFilter} BETWEEN '${startDate}' AND '${endDate}'`;
            } else {
                query = `SELECT * FROM tracks WHERE CONVERT(VARCHAR, ${searchFilter}, 120) LIKE '%${searchTerm}%'`;
            }
        } else {
            query = `SELECT * FROM tracks WHERE CONVERT(TEXT, ${searchFilter}) LIKE '%${searchTerm}%'`;
        }

        if (query.includes('WHERE')) {
            query += ` AND dispEmail = '${UserData.email}'`;
        } else {
            query += ` WHERE dispEmail = '${UserData.email}'`;
        }

        if (searchFilter === 'createdDateTime' || searchFilter === 'requestDate') {
            query += ` ORDER BY ${searchFilter} DESC`;
        } else {
            query += ` ORDER BY docID DESC`;
        }

        const result = await request.query(query);
        const searchResults = result.recordset;
        let count = searchResults.length
        res.render('uSearch', { 
            UserData,
            searchFilter: searchFilter,
            searchTerm: searchTerm,
            searchResults: searchResults,
            count,
            errors: req.flash('validationErrors') });

    } catch (error) {
        req.flash('data', req.body);
        req.flash('validationErrors', error.message);
        return res.redirect('/uSearch');

    } finally {
        await sql.close();
    }
};
