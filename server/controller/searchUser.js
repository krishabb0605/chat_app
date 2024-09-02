const UserModel = require('../models/UserModel');

const searchUser = async (req, res) => {
  try {
    const { search } = req.body;

    // i for can sensetive and g for global
    const query = new RegExp(search, 'i', 'g');
    const user = await UserModel.find({
      $or: [{ name: query }, { email: query }],
    }).select('-password')

    return res.json({
      message: 'All user ',
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

module.exports = searchUser;
