const { scheduledJobs } = require('../functions/taskService');

module.exports = async (req, res) => {
    try {
        res.render('tester', {scheduledJobs});   
    } catch (error) {
        delete req.session.user;
        req.flash('validationErrors', error.message);
        return res.redirect('/');
    }
};
