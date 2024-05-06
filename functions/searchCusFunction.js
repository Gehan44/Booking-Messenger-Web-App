const sql = require('mssql');
const sqlConfig = require('../sqlConfig');

const autofillFunction = async (req, res) => {
    const nameCus = req.body.nameCus;
    const placeCus = req.body.placeCus;
    const telCus = req.body.telCus;
    const userData = req.session.user;
    const userID = userData.userID;
    const userRole = userData.role;

    try {
        await sql.connect(sqlConfig);
        const request = new sql.Request();

        let query = `SELECT cusID, cusName, cusPlace, cusTel, userIDCreated FROM customers WHERE 1 = 1`;
        
        if (nameCus) {
            query += ` AND cusName LIKE '%' + @nameCus + '%'`;
        }

        if (placeCus) {
            query += ` AND cusPlace LIKE '%' + @placeCus + '%'`; 
        }

        if (telCus) {
            query += ` AND cusTel LIKE '%' + @telCus + '%'`; 
        }

        if (userRole === 'User') {
            query += ` AND userIDCreated = @userID`;
        }

        const queryParams = {
            nameCus: `${nameCus}`,
            placeCus: `${placeCus}`,
            telCus: `${telCus}`,
            userID: `${userID}`
        };

        const result = await request.input('nameCus', sql.NVarChar, queryParams.nameCus)
                                      .input('placeCus', sql.NVarChar, queryParams.placeCus)
                                      .input('telCus', sql.NVarChar, queryParams.telCus)
                                      .input('userID', sql.NVarChar, queryParams.userID)
                                      .query(query);

        if (result.recordset.length === 0) {
            //throw new Error('No results found');
        }

        res.json(result.recordset);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        sql.close();
    }
};

module.exports = autofillFunction;
