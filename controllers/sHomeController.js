const runDashboard = require('../functions/searchAllFunction');

module.exports = async (req, res) => {
  const UserData = req.session.user;
    try {
      const allResults = await runDashboard(UserData);
      res.render('sHome', { UserData,allResults });
    } catch (error) {
      console.error('Error during search:', error);
      res.status(500).send('Internal Server Error');
    }
};
