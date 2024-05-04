module.exports = async (req, res, next) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/')
        }
        if (user.role !== 'Support') {
            return res.redirect('/');
        }
        next();
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};
