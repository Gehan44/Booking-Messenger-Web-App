const sql = require('mssql');
const sqlConfig = require('../../sqlConfig');

const deleteUserFunction = async (req, res) => {
    let searchTerm = req.body.searchTerm;

    if (!Array.isArray(searchTerm)) {
        searchTerm = [searchTerm];
    }

    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();

        const query = `
            DELETE FROM [dbo].[users] WHERE userID = @searchTerm
        `;

        for (let i = 0; i < searchTerm.length; i++) {
            const result = await request.input('searchTerm', sql.Int, searchTerm[i]).query(query);
        }

        sql.close();
        res.redirect('/register/delete');
    } catch (error) {
        console.error('Error:', error);
    }
};

module.exports = deleteUserFunction;
