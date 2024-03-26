module.exports = (req,res) => {
    let email = ""
    let password = ""
    let name = ""
    let role = ""
    let data = req.flash('data')[0]

    if (typeof data != "undefined") {
        email = data.email
        password = data.password
        name = data.name
        role = data.role
    }

    res.render('register',{
        email: email,
        password: password,
        name: name,
        role: role,
        errors: req.flash('validationErrors')
    })
}