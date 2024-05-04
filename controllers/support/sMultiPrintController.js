const runDashboard = require('../../functions/searchAllFunction');

module.exports = async (req, res) => {
    const UserData = req.session.user;
    let searchTerm = "";
    let data = req.flash('data')[0];

    if (typeof data !== "undefined") {
        searchTerm = data.searchTerm;
    }

    try {
        const allResults = await runDashboard(UserData);
        const createdResults = allResults.filter(result => result.status === 'Created');
        res.render('sForgot', {
            UserData,
            allResults: createdResults,
            searchTerm: searchTerm,
            errors: req.flash('validationErrors')
        });
      
    } catch (error) {
        delete req.session.user;
        req.flash('validationErrors', error.message);
        return res.redirect('/');
    }
};
