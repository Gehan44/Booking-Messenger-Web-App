const runDashboard = require('../../functions/searchAllFunction');

module.exports = async (req, res) => {
  const UserData = req.session.user;
    try {
      const allResult = await runDashboard(UserData);
      const allResults = allResult.filter(result =>
        ((result.userNameSend === 'Outsource') && (result.status !== 'Done' && result.status !== 'Returned' && result.status !== 'Failed' )) ||
        ((result.docSendReturn === 'รับ' || result.docSendReturn === 'ส่งรอรับกลับ') && (result.status !== 'Created' && result.status !== 'Done' && result.status !== 'Returned' && result.status !== 'Failed' && result.docSendReturn !== 'ส่ง'))
      );
      const count = allResults.length
      res.render('sManage', {
        UserData,
        allResults,
        count });
      
    } catch (error) {
      delete req.session.user;
      req.flash('validationErrors', error.message);
      return res.redirect('/')
  }
};
