const runDashboard = require('../../functions/searchAllFunction');

module.exports = async (req, res) => {
  const UserData = req.session.user;
    try {
      const allResult = await runDashboard(UserData);
      const createdResults = allResult.filter(result =>
      (result.userNameSend === 'Outsource' || result.docSendReturn === 'รับ' || result.docSendReturn === 'ส่งรอรับกลับ') &&
       (result.status !== 'Done' && result.status !== 'Returned' && result.status !== 'Failed'));
      const allResults = allResult.filter(result =>
        (result.userNameSend === 'Outsource' || result.docSendReturn === 'รับ' || result.docSendReturn === 'ส่งรอรับกลับ') &&
         (result.status !== 'Done' && result.status !== 'Returned' && result.status !== 'Failed'));
      res.render('sManage', {
        UserData,
        allResult: createdResults,
        allResults });
      
    } catch (error) {
      delete req.session.user;
      req.flash('validationErrors', error.message);
      return res.redirect('/')
  }
};
