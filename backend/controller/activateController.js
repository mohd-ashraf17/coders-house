const jimp = require('jimp');
const path = require('path');
const User = require('../model/userModel')
const UserDto = require('../Dtos/userDto')

class ActivateController {
    async activate(req, res) {
        const { name, avatar } = req.body;
        if (!name) {
            return res.status(402).res.json({ message: 'all fields are required!' })
        }
        if (avatar) {
            const buffer = Buffer.from(avatar.replace("data:image/png;base64,", ''), 'base64');
            const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
            try {
                jimp.read(buffer, (err, resp) => {
                    resp.resize(150, jimp.AUTO).write(path.resolve(__dirname, `../storage/${imagePath}`))
                });

            } catch (err) {
                return res.status(501).json({ message: 'could not process the image' });
            }
        }
        try {
            let user = await User.findOne({ _id: req.user._id });
            if (!user) {
                throw new error()
            }
            user.name = name;
            user.activated = true;
            if (avatar) {
                user.avatar = `/storage/${imagePath}`;
            }
            await user.save();
            const newUser = new UserDto(user)
            return res.json({ user: newUser, auth: true })
        } catch (err) {
            return res.status(501).json({ message: 'something went wrong!' });
        }
    }
}

module.exports = new ActivateController()