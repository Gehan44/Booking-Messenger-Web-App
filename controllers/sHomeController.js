const runDashboard = require('../functions/searchLimitFunction');

module.exports = async (req, res) => {
  const UserData = req.session.user;
    try {
      const allResults = await runDashboard(UserData);
      res.render('sHome', { UserData,allResults });
      
    } catch (error) {
      delete req.session.user;
      req.flash('validationErrors', error.message);
      return res.redirect('/')
    }
};
