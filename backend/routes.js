const Router = require('express').Router();
const authController = require('./controller/authController')
const activateController = require('./controller/activateController')
const auth = require('./middlewares/auth')
const roomsController = require('./controller/roomsController')

Router.get('/', (req, res) => { res.send('hello') })
Router.post('/api/send-otp', authController.register)
Router.post('/api/verify-Otp', authController.verifyOtp)
Router.post('/api/activate', auth, activateController.activate)
Router.post('/api/refresh', authController.refresh)
Router.post('/api/logout', auth, authController.logout)
Router.post('/api/room', auth, roomsController.create)
Router.post('/api/rooms', auth, roomsController.index);
Router.post('/api/rooms/:roomId', auth, roomsController.show)

module.exports = Router