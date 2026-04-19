const {
  registerUser,
  loginUser,
} = require("../services/auth.service");
const { success, error } = require("../utils/response");

async function register(req, res) {
  try {
    const user = await registerUser(req.body);
    return success(res, user, "User registered");
  } catch (err) {
    return error(res, err.message);
  }
}

async function login(req, res) {
  try {
    const data = await loginUser(req.body);
    return success(res, data, "Login successful");
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  register,
  login,
};
