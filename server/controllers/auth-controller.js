const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");

class AuthController {
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = await otpService.generateotp();

    //hash
    const ttl = 1000 * 60 * 2; // 2 minutes
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = hashService.hashOtp(data);

    //send otp
    try {
      await otpService.sendBySms(phone, otp);
      res.status(200).json({
        hash: `${hash}.${expires}`,
        phone,
        otp,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error sending OTP" });
    }
  }

  async verifyOtp(req, res) {
    const { phone, otp, hash } = req.body;
    if (!phone || !otp || !hash) {
      res.status(400).json({ message: "All fields are required" });
    }

    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      res.status(400).json({ message: "OTP expired" });
    }

    const data = `${phone}.${otp}.${expires}`;

    const isValid = otpService.verifyOtp(hashedOtp, data);

    if (!isValid) {
      res.status(400).json({ message: "Invalid OTP" });
    }

    let user;

    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error finding user" });
    }

    //Token
    const {accessToken,refreshToken} = tokenService.generateTokens({_id: user._id, activated: false});

    res.cookie('refreshToken',refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    });

    res.json({accessToken});

  }
}

module.exports = new AuthController();