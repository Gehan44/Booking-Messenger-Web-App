const runDashboard = require('../functions/searchLimitFunction');

module.exports = async (req, res) => {
  const UserData = req.session.user;
    try {
      const allResults = await runDashboard(UserData);
      const count = allResults.length
      res.render('sHome', { 
        UserData,
        allResults,
        count });
      
    } catch (error) {
      delete req.session.user;
      req.flash('validationErrors', error.message);
      return res.redirect('/')
    }
};
