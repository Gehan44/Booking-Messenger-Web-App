const sql = require('mssql');
const bcrypt = require('bcrypt');
const sqlConfig = require('../sqlConfig');

module.exports = async function createUser(userData) {
    if (!userData.email || !userData.password || !userData.name || !userData.role) {
        throw new Error('กรุณากรอกให้ครบ: email, password, name, role');
    }

    const password = userData.password.length
    if (password < 8) {
        throw new Error('รหัสต้องมากกว่า 8 ตัว')
    }

    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();

        const check = await request.query`SELECT * FROM dbo.users WHERE email = ${userData.email}`;
        const user = check.recordset[0];

        if (user && user.email === userData.email) {
            const result = await request.query(`
            UPDATE [dbo].[users] SET password = '${hashedPassword}', name = '${userData.name}', 
            role = '${userData.role}' WHERE email = '${userData.email}'`);
        } else {
            const result = await request.query(`
            INSERT INTO [dbo].[users] ([email], [password], [name], [role])
            OUTPUT Inserted.userID -- Include this line to output the inserted userID
            VALUES ('${userData.email}', '${hashedPassword}', '${userData.name}', '${userData.role}')
            `);
        }
        sql.close();

    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}