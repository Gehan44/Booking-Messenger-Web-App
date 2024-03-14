module.exports = (req, res) => {
  const UserData = req.session.user;
  let searchFilter = ""
  let searchTerm = ""
  let searchResults = ""
  let data = req.flash('data')[0]

  if (typeof data != "undefined") {
    searchTerm = data.searchTerm
  }
  
  res.render('search', { 
    UserData,
    searchFilter: searchFilter,
    searchTerm: searchTerm,
    searchResults: searchResults,
    errors: req.flash('validationErrors') });
}