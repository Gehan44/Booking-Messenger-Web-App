const sql = require('mssql');
const sqlConfig = require('../../sqlConfig');

const addDispFunction = async (req, res) => {
    const nameDisp = req.body.nameDisp;
    const emailDisp = req.body.emailDisp;
    const telDisp = req.body.telDisp;
    const userData = req.session.user;

    if (!nameDisp || !emailDisp || !telDisp) {
        res.status(400).send('Please provide values for nameDisp, emailDisp, and telDisp');
        return;
    }

    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[dispatchers] (dispName, dispEmail, dispTel)
            VALUES (@nameDisp, @emailDisp, @telDisp)
        `;
        
        const result = await request.input('nameDisp', sql.NVarChar, nameDisp)
                                      .input('emailDisp', sql.NVarChar, emailDisp)
                                      .input('telDisp', sql.NVarChar, telDisp)
                                      .query(query);

        sql.close();
        res.status(200).send('Dispatcher added successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = addDispFunction;
