module.exports = (req, res) => {
    let email = ""
    let data = req.flash('data')[0]

    if (typeof data != "undefined") {
        email = data.email
    }

    res.render('login',{
        email: email,
        errors: req.flash('validationErrors')
    })
}