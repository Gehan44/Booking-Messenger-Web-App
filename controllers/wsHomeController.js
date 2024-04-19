const runDashboard = require('../functions/searchLimitFunction');

module.exports = async (req, res) => {
  const UserData = req.session.user;
    try {
      const allResults = await runDashboard(UserData);

      const createdResults = allResults.filter(result => result.status !== 'Done' && result.status !== 'Returned' && result.status !== 'Failed');
      res.render('wsHome', {
        UserData,
        allResult: createdResults,
        allResults });
      
    } catch (error) {
      delete req.session.user;
      req.flash('validationErrors', error.message);
      return res.redirect('/')
  }
};
