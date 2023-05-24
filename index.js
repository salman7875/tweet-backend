require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const userRoutes = require('./routes/users')
const tweetRoutes = require('./routes/tweets')

const app = express()

// DB CONNECTION
// mongoose
//   .connect(process.env.DB)
//   .then(() => console.log('DB Connected'))
//   .catch(err => console.log(err.message))
mongoose.set('strictQuery', false)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB)
    console.log('MongoDB Connected: ' + conn.connection.host)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

// MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ROUTES
app.use('/api', userRoutes)
app.use('/api/tweets', tweetRoutes)

// SERVER LISTENING
const PORT = process.env.PORT || 5000
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on PORT: http://localhost:${PORT}`)
  )
})
