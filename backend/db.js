const mongoose = require('mongoose');

const dbConnection = () => {
    mongoose.connect(process.env.DB_URL, {
        UseUnifiedTopology: true
    })
    const db = mongoose.connection;
    db.on('open', () => {
        console.log('database connected!')
    })
}

module.exports = dbConnection