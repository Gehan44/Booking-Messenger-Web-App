module.exports = (req, res) => {
  const UserData = req.session.user;
  let searchFilter = ""
  let searchTerm = ""
  let searchResults = ""
  let count = searchResults.length
  let data = req.flash('data')[0]

  if (typeof data != "undefined") {
    searchTerm = data.searchTerm
  }
  
  res.render('sSearch', { 
    UserData,
    searchFilter: searchFilter,
    searchTerm: searchTerm,
    searchResults: searchResults,
    count,
    errors: req.flash('validationErrors') });
}