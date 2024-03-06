const sql = require('mssql');
const config = require('../sqlConfig');

module.exports = async (req, res) => {
    try {
        const UserData = req.session.user;
        let searchTerm = req.body.searchTerm;
        let searchFilter = req.body.searchFilter;

        if (!searchFilter) {
            let searchResults = null;
            res.render('ssearch', { UserData, searchTerm, searchFilter, searchResults});
            return
        }

        if (searchFilter === 'createdDate') {
            searchFilter = 'createdDateTime';
        }
        
        if (searchFilter === 'createdDateTime' || searchFilter === 'requestDate') {
            searchTerm = searchTerm.replace('T', ' ');
        }

        await sql.connect(config);
        const request = new sql.Request();
        let query = `SELECT * FROM tracks`;
        
        if (searchFilter === 'docTime') {
            query += ` WHERE CONVERT(TIME, ${searchFilter}) = CONVERT(TIME, '${searchTerm}')`;
        } else if (searchFilter === 'createdDateTime' || searchFilter === 'requestDate') {
            query += ` WHERE CONVERT(VARCHAR, ${searchFilter}, 120) LIKE '%${searchTerm}%'`;
        } else {
            query += ` WHERE CONVERT(TEXT, ${searchFilter}) LIKE '%${searchTerm}%'`;
        }
        
        if (UserData.role === "Sale") {
            if (query.includes('WHERE')) {
                query += ` AND userIDCreated = '${UserData.userID}'`;
            } else {
                query += ` WHERE userIDCreated = '${UserData.userID}'`;
            }
        }
        
        const result = await request.query(query);
        const searchResults = result.recordset;

        if (UserData.role === "Sale") {
            res.render('ssearch', { UserData, searchTerm, searchResults, searchFilter });
        } else {
            res.render('search', { UserData, searchTerm, searchResults, searchFilter });
        }
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await sql.close();
    }
};
