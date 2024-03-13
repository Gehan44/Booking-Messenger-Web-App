module.exports = (req, res) => {
    const UserData = req.session.user;
    let data = req.flash('data')[0]

    res.render('forgot', {
      UserData,
      errors: req.flash('validationErrors')
    });
  };
  