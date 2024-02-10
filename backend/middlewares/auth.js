const JwtService = require('../service/jwtService')

const auth = async (req, res, next) => {
    try{
        // const { accesToken } = req.cookies;
        const { accessToken } = req.body;
        if(!accessToken) {
            throw new error()
        }
        const userData = await JwtService.verifyToken(accessToken);
        req.user = userData;
        next()
    }catch(err) {
        res.status(401).json({message: 'invalid token'});
    }
}

module.exports = auth