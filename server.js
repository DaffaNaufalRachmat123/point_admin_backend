const app = require('express')()
const bodyParser = require('body-parser')
const users = require('./controllers/users')
const transactions = require('./controllers/transactions')
const rewards = require('./controllers/rewards')
const passport = require('passport')
require('./auth/auth')(passport)

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use('/api/users' , users)
app.use('/api/transactions' , transactions)
app.use('/api/rewards' , rewards)

app.listen(process.env.PORT || 3400)