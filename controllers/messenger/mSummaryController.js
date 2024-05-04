const runDashboard = require('../../functions/searchLimitFunction');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');
nowDateTime = moment().format('YYYY-MM-DD')

module.exports = async (req, res) => {
  const UserData = req.session.user;
    try {
      const createdResults = await runDashboard(UserData);
      const allResults = createdResults.filter(result => moment(result.requestDate).format('YYYY-MM-DD') === nowDateTime 
      && (result.status === 'Created' || result.status === 'Incomplete' ||  result.status === 'Picked' ));
      res.render('mSummary', {
        UserData,
        allResults });
      
    } catch (error) {
      delete req.session.user;
      req.flash('validationErrors', error.message);
      return res.redirect('/')
  }
};
