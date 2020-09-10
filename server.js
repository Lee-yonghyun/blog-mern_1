const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const dotEnv = require('dotenv')
dotEnv.config()
require('./config/database')
const userRoutes = require('./routes/user')
const profileRoutes = require('./routes/profile')



app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))



app.use('/user',userRoutes)
app.use('/profile', profileRoutes)




PORT = process.env.PORT || 6012
app.listen(PORT, () => console.log(`server started...on port ${PORT}`))