const crypto = require('crypto')
const nodemailer = require('nodemailer');

class OptService {
    generateOTP() {
        const otp = crypto.randomInt(1000, 9999);
        // const otp = crypto.randomBytes(64).toString("hex");
        return otp
    }
    hashOTP(data) {
        return crypto.createHmac('sha256', process.env.HASH_SECRET).update(data).digest('hex');
    }
    async sendBYMail(options) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        const mailOptions = {
            from: "codershouse5@gmail.com",
            to: options.email,
            subject: options.subject,
            html: options.html
        }
        await transporter.sendMail(mailOptions);
    }
    verifyOTP(hashOtp, data) {
        const hash = crypto.createHmac('sha256', process.env.HASH_SECRET).update(data).digest('hex');
        return hashOtp === hash;
    }
}

module.exports = new OptService