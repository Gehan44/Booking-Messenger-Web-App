const sql = require('mssql');
const sqlConfig = require('../sqlConfig');

const addCusFunction = async (req, res) => {
    const nameCus = req.body.nameCus;
    const placeCus = req.body.placeCus;
    const telCus = req.body.telCus;
    const userData = req.session.user;

    if (!nameCus || !placeCus || !telCus) {
        res.status(400).send('Please provide values for nameCus, placeCus, and telCus');
        return;
    }

    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[customers] (cusName, cusPlace, cusTel, userIDCreated)
            VALUES (@nameCus, @placeCus, @telCus, @userIDCreated)
        `;
        
        const result = await request.input('nameCus', sql.NVarChar, nameCus)
                                      .input('placeCus', sql.NVarChar, placeCus)
                                      .input('telCus', sql.NVarChar, telCus)
                                      .input('userIDCreated', sql.Int, userData.userID)
                                      .query(query);
                                      
        sql.close();
        res.status(200).send('Customer added successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = addCusFunction;
