module.exports = async (req, res) => {
  const searchTerm = req.query.searchTerm || '';
  const searchResults = req.query.searchResults || '';
  const searchFilter = req.query.searchFilter || '';
  const UserData = req.session.user;

  try {
    res.render('ssearch', { UserData, searchTerm, searchResults, searchFilter });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).send('Internal Server Error');
  }
};
