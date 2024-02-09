const Router = require('express').Router();
const authController = require('./controller/authController')
const activateController = require('./controller/activateController')
const auth = require('./middlewares/auth')
const roomsController = require('./controller/roomsController')

Router.get('/', (req, res) => { res.send('hello') })
Router.post('/api/send-otp', authController.register)
Router.post('/api/verify-Otp', authController.verifyOtp)
Router.post('/api/activate', auth, activateController.activate)
Router.get('/api/refresh', authController.refresh)
Router.post('/api/logout', auth, authController.logout)
Router.post('/api/rooms', auth, roomsController.create)
Router.get('/api/rooms', auth, roomsController.index);
Router.get('/api/rooms/:roomId', auth, roomsController.show)

module.exports = Router