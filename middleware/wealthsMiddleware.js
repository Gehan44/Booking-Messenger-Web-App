module.exports = async (req, res, next) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/login')
        }
        if (user.role !== 'Wealth Support') {
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
};
