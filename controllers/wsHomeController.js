const runDashboard = require('../functions/searchAllFunction');

module.exports = async (req, res) => {
    try {
      const UserData = req.session.user;
      const allResults = await runDashboard(UserData);
      res.render('wsHome', { UserData,allResults });
    } catch (error) {
      console.error('Error during search:', error);
      res.status(500).send('Internal Server Error');
    }
};
