module.exports = (req, res) => {
    const UserData = req.session.user;
    let searchTerm = ""
    let data = req.flash('data')[0]

    if (typeof data != "undefined") {
      searchTerm = data.searchTerm
    }

    res.render('forgot', {
      UserData,
      searchTerm: searchTerm,
      errors: req.flash('validationErrors')
    });
  };