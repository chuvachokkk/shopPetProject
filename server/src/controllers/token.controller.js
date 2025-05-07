const { generateTokens } = require("../services/token.service");
const { refresh } = require("../config/jsw.config");

async function refreshAccessToken(req, res, next) {
  const userDto = {
    id: req.user.id,
    email: req.user.email,
    address: req.user.address,
    phone: req.user.phone,
    name: req.user.name,
    surname: req.user.surname,
    lastname: req.user.lastname,
    role: req.user.role,
  };

  try {
    const { refreshToken, accessToken } = await generateTokens({ ...userDto });
    res
      .cookie("refresh_token", refreshToken, refresh)
      .json({ user: { ...userDto }, accessToken });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { refreshAccessToken };
