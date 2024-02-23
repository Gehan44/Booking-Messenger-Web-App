const bcrypt = require('bcrypt');
const sql = require('mssql');
const sqlConfig = require('../sqlConfig.js');

module.exports = async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        await sql.connect(sqlConfig);
        const result = await sql.query`SELECT * FROM dbo.users WHERE email = ${email}`;
        const user = result.recordset[0];

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                if (user.role === 'Messenger') {
                    req.session.user = {
                        userID: user.userID,
                        name: user.name,
                        role: user.role
                    };
                    res.redirect('/mHome');
                } else if (user.role === 'Wealth Support') {
                    req.session.user = {
                        userID: user.userID,
                        name: user.name,
                        role: user.role
                    };
                    res.redirect('/wsHome');
                } else if (user.role === 'Sale') {
                    req.session.user = {
                        userID: user.userID,
                        name: user.name,
                        role: user.role
                    };
                    res.redirect('/sHome');
                } else {
                    res.redirect('/login');
                }
            } else {
                res.render('login', { message: 'Incorrect email or password' });
            }
        } else {
            res.render('login', { message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.render('login', { message: 'An error occurred' });
    } finally {
        await sql.close();
    }
};
