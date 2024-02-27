const sql = require('mssql');
const bcrypt = require('bcrypt');
const sqlConfig = require('../sqlConfig');

module.exports = async function createUser(userData) {
    // Check if all required fields are present
    if (!userData.email || !userData.password || !userData.name || !userData.role) {
        throw new Error('Please provide all required fields: email, password, name, role');
    }

    try {
        console.log(userData.password);
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        const result = await request.query(`
            INSERT INTO [dbo].[users] ([email], [password], [name], [role])
            OUTPUT Inserted.userID -- Include this line to output the inserted userID
            VALUES ('${userData.email}', '${hashedPassword}', '${userData.name}', '${userData.role}')
        `);
        sql.close();
        
        return result.recordset[0].userID;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
