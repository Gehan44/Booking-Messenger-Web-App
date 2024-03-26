const runDashboard = require('../functions/searchAllFunction');

module.exports = async (req, res) => {
  const UserData = req.session.user;
    try {
      const allResults = await runDashboard(UserData);
      res.render('wsHome', { UserData,allResults });
      
    } catch (error) {
      delete req.session.user;
      req.flash('validationErrors', error.message);
      return res.redirect('/')
  }
};
