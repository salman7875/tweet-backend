const mongoose = require('mongoose')

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_PROD)
        console.log('DB Connected');
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = { connect }