module.exports = async (req, res) => {
  const searchTerm = req.query.searchTerm || '';
  const searchResults = req.query.searchResults || '';
  const UserData = req.session.user;

  try {
      res.render('search', { UserData,searchTerm,searchResults });
  } catch (error) {
      console.error('Error during search:', error);
      res.status(500).send('Internal Server Error');
  }
};
