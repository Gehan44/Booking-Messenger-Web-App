const sql = require('mssql');
const sqlConfig = require('../../sqlConfig');

const autofillFunction = async (req, res) => {
    const nameDisp = req.body.nameDisp;
    const emailDisp = req.body.emailDisp;
    const telDisp = req.body.telDisp;

    try {
        await sql.connect(sqlConfig);
        const request = new sql.Request();

        let query = `SELECT dispID, dispName, dispEmail, dispTel FROM dispatchers WHERE 1 = 1`;
        
        if (nameDisp) {
            query += ` AND dispName LIKE '%' + @nameDisp + '%'`;
        }

        if (emailDisp) {
            query += ` AND dispEmail LIKE '%' + @emailDisp + '%'`; 
        }

        if (telDisp) {
            query += ` AND dispTel LIKE '%' + @telDisp + '%'`; 
        }

        const queryParams = {
            nameDisp: `${nameDisp}`,
            emailDisp: `${emailDisp}`,
            telDisp: `${telDisp}`
        };

        const result = await request.input('nameDisp', sql.NVarChar, queryParams.nameDisp)
                                      .input('emailDisp', sql.NVarChar, queryParams.emailDisp)
                                      .input('telDisp', sql.NVarChar, queryParams.telDisp)
                                      .query(query);

        if (result.recordset.length === 0) {
            throw new Error('No results found');
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
