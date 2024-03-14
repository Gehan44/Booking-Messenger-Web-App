module.exports = (req, res) => {
    let email = ""
    let data = req.flash('data')[0]

    if (typeof data != "undefined") {
        email = data.email
    }

    res.render('login',{
        errors: req.flash('validationErrors'),
        email: email
    })
}