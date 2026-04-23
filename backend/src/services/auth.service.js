const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail } = require("../models/user.model");
const { createStudent } = require("../models/student.model");
const { generateToken } = require("../utils/jwt");

async function registerUser(data) {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  // Check existing user
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser(name, email, hashedPassword);

  // 🔥 create student profile automatically
  await createStudent(user.id);

  // 🔐 Generate token so frontend can auto-login after signup
  const token = generateToken(user);

  // Remove password from response
  delete user.password;

  return { token, user };
}

async function loginUser(data) {
  const { email, password } = data;

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  // 🔐 Remove password from response
  delete user.password;

  return { token, user };
}

module.exports = {
  registerUser,
  loginUser,
};
