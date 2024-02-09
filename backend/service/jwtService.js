const Refresh = require('../model/tokenModel')

const jwt = require('jsonwebtoken');

class JwtService {
    signToken(payload) {
        const accesToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '1m'
        })

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '1y'
        })

        return { accesToken, refreshToken }
    }

    async verifyToken(token) {
        return await jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    }
    async verifyRefreshToken(token) {
        return await jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    }

    async storeToken(token, customerId) {
        try {
            await Refresh.create({
                token,
                customerId
            })

        } catch (err) {
            console.log(err)
        }
    }
    async findRefreshToken(userId, token) {
        return await Refresh.findOne({ customerId: userId, token: token });
    }
    async updateRefreshToken(userId, token) {
        return await Refresh.updateOne({ customerId: userId }, { token: token });
    }
    async deleteRefreshToken(token) {
        return await Refresh.deleteOne({ token: token })
    }
}

module.exports = new JwtService;