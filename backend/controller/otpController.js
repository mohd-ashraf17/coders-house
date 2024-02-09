const OptService = require('../service/otpService')

class OtpController {
    otp(req, res) {

        const { number } = req.body;
        if(!number) {
            return res.status(406).json({ message: 'number is required'})
        }

        const otp = OptService.generateOTP()
        res.json({otp})
    }

}

module.exports = new OtpController;