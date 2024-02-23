module.exports = async (req, res, next) => {
    try {
        const user = req.session.user;
        if (user.role !== 'Messenger') {
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
};
