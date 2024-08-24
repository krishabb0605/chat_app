const UserModel = require('../models/UserModel');

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // get data and remove password field from that data using select
    const checkEmail = await UserModel.findOne({ email }).select('-password');

    if (!checkEmail) {
      return res.status(400).json({
        message: 'User with this EmailId is not exists',
        error: true,
      });
    }

    return res.status(201).json({
      message: 'Email verify',
      data: checkEmail,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

module.exports = checkEmail;
