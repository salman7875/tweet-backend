require('dotenv').config()
const express = require('express')
const cors = require('cors')

const { connect } = require('./config/db')
const userRoutes = require('./routes/users')
const tweetRoutes = require('./routes/tweets')

const app = express()

// DB CONNECTION


// MIDDLEWARE
app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// ROUTES
app.use('/api', userRoutes)
app.use('/api/tweets', tweetRoutes)


app.get('/', (req, res) => {
  res.json({ success: true, message: 'TweetSpot backend is ready....' })
})

// SERVER LISTENING
const PORT = process.env.PORT || 6000
app.listen(PORT, async () => {
  console.log(`Server running on PORT: http://localhost:${PORT}`)
  await connect()
})
