const runDashboard = require('../../functions/admin/searchUserFunction');

module.exports = async (req,res) => {
    const UserData = req.session.user;
    let data = req.flash('data')[0]
    try {
        const allResult = await runDashboard();
        const allResults = allResult.filter(result =>
            (result.name !== 'Admin')
          );
        res.render('aDelete', {
          UserData,
          allResults,
          errors: req.flash('validationErrors') });
        
      } catch (error) {
        delete req.session.user;
        req.flash('validationErrors', error.message);
        return res.redirect('/')
    }
}