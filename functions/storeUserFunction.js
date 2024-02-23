const createUser = require('../models/user');

module.exports = async (req, res) => {
    const { email, password, name, role } = req.body;
    try {
        const userID = await createUser(req.body);
        console.log("User registered successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
};