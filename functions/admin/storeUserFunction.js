const createUser = require('../../models/user');

module.exports = async (req, res) => {
    const { email, password, name, role } = req.body;
    try {
        await createUser(req.body);
        return res.redirect('/register');
        
    } catch (error) {
        req.flash('data', req.body);
        req.flash('validationErrors', error.message);
        return res.redirect('/register');
    }
};
