const runDetect = require('../functions/detectTrackFunction.js');

module.exports = async (req, res) => {
  const UserData = req.session.user;

  let updatedEditTerm = req.query.updatedEditTerm;
  let noteEditTerm = req.query.noteEditTerm;
  let VariantData = null;
  try {
    if (updatedEditTerm) {
      updatedEditTerm = updatedEditTerm.toUpperCase();
      VariantData = await runDetect(updatedEditTerm);
    }
    res.render('mHome', { updatedEditTerm, UserData, VariantData,noteEditTerm });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send('Internal Server Error');
  }
};