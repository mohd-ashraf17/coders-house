const OptService = require('../service/otpService')
const JwtService = require('../service/jwtService')
const User = require('../model/userModel')
const joi = require('joi');
const UserDto = require('../Dtos/userDto');
const jwtService = require('../service/jwtService');

class authController {
    async register(req, res) {
        // console.log(req.body)
        const { email } = req.body;
        if (!email) {
            return res.status(406).json({ message: "email is required" })
        }
        // const validation = joi.object({
        //     email: joi.email().require()
        // })

        // const { error } = validation.validate(req.body);
        // if(error) {
        //     return res.status(406).json(error)
        // }

        const otp = OptService.generateOTP()
        //data
        const ttl = 1000 * 60 * 2;
        const expires = Date.now() + ttl;
        const data = `${email}.${otp}.${expires}`;
        const hash = OptService.hashOTP(data);

        // send mail
        try {
            await OptService.sendBYMail({
                email: email,
                subject: "OTP from codersHouse!",
                html: require('../service/otpTemplate')({ otp })
            })
            return res.json({ hash: `${hash}.${expires}` })

        } catch (err) {
            return res.status(409).json({ message: "message send fail!" })
        }
    };

    async verifyOtp(req, res) {
        const { email, otp, hash } = req.body;
        if (!email || !otp || !hash) {
            return res.status(406).json({ message: "all fields are required" });
        }
        const [hashOtp, expires] = hash.split('.');
        // console.log(hashOtp, expires)
        if (Date.now() > expires) {
            return res.status(406).json({ message: "otp expired!" })
        }
        const data = `${email}.${otp}.${expires}`;
        const isValid = OptService.verifyOTP(hashOtp, data)
        // console.log(isValid)
        if (!isValid) {
            return res.status(406).json({ message: "invalid OTP!" });
        }
        let user;
        try {
            user = await User.findOne({ email });
            console.log(user)
            if (!user) {
                user = await User.create({ email })
            }
        } catch {
            return res.status(500).json({ message: "db error" });
        }

        const { accesToken, refreshToken } = await JwtService.signToken({ _id: user._id, activated: user.activated });
        await jwtService.storeToken(refreshToken, user._id)

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        res.cookie('accesToken', accesToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        const userDto = new UserDto(user)
        return res.json({ user: userDto, auth: true })

    }
    async refresh(req, res) {
        // get refresh token fron cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        // check if token is valid
        let userData
        try {
            userData = await jwtService.verifyRefreshToken(refreshTokenFromCookie);
        } catch (err) {
            return res.status(401).json({ message: 'invalid token' });
        }
        // check if token is in db
        let token;
        try {
            token = await jwtService.findRefreshToken(userData._id, refreshTokenFromCookie)
            if (!token) {
                return res.status(401).json({ message: 'internal error' })
            }
        } catch (err) {
            return res.status(401).json({ message: 'invalid token' })
        }
        // check user in db
        const user = await User.findOne({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: 'no user' })
        }
        // generate new tokens
        const { accesToken, refreshToken } = jwtService.signToken({ _id: user._id });
        // set tokens in cookie
        try {
            await jwtService.updateRefreshToken(user._id, refreshToken);
        } catch (err) {
            return res.status(500).json({ message: 'internal error' })
        }
        // add in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        res.cookie('accesToken', accesToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        // send response
        const userDto = new UserDto(user)
        return res.json({ user: userDto, auth: true })
    }

    async logout(req, res) {
        // delete refresh token
        const { refreshToken } = req.cookies;
        await jwtService.deleteRefreshToken(refreshToken);
        // delete cookie
        res.clearCookie("refreshToken")
        res.clearCookie("accesToken")
        return res.json({ user: null, auth: false })
    }

}

module.exports = new authController;