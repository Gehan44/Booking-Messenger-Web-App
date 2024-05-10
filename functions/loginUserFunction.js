const bcrypt = require('bcrypt');
const sql = require('mssql');
const sqlConfig = require('../sqlConfig.js');
require('dotenv').config();

module.exports = async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        await sql.connect(sqlConfig);
        const result = await sql.query`SELECT * FROM dbo.users WHERE email = ${email}`;
        const user = result.recordset[0];

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                if (user.email === "admin@pinewealthsolution.com") {
                    req.session.user = {
                        userID: user.userID,
                        email: user.email,
                        name: user.name,
                        role: "Admin"
                    };
                    return res.redirect('/register');
                } else if (user.role === 'Messenger') {
                    req.session.user = {
                        userID: user.userID,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                    return res.redirect('/mHome');
                } else if (user.role === 'Support') {
                    req.session.user = {
                        userID: user.userID,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                    res.redirect('/sHome');
                } else if (user.role === 'User') {
                    req.session.user = {
                        userID: user.userID,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                    return res.redirect('/uHome');
                } else {
                    return res.redirect('/');
                }
            } else {
                throw new Error('อีเมลหรือรหัสผ่านผิด')
            }
        } else {
            throw new Error('ไม่ค้นพบผู้ใช้งานนี้')
        }
    } catch (error) {
        req.flash('data', req.body);
        req.flash('validationErrors', error.message);
        return res.redirect('/')

    } finally {
        await sql.close();
    }
};
