const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('./models/User');
const { urlencoded } = require('body-parser');

dotenv.config()

const app = express()

mongoose.connect(
process.env.DATABASE,
{ useNewUrlParser: true, useUnifiedTopology: true },
  err=> {
    if(err) {
        console.log(err)
    }
    else {
        console.log('Connected to the mongodb server!!')
    }
})

// Middlewares

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req,res) => {
    res.json("Hello amazon clone")
})

app.post('/',(req,res) => {
    // console.log(req.body.name)
    let user = new User()
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password

    user.save(err => {
      if (err) {
        res.json(err)
      } else {
        res.json("Successfully saved!!")
      }
    })
})

// require api's
const productRoutes = require('./routes/product')
const categoryRoutes = require('./routes/category')
const ownerRoutes = require('./routes/owner')

app.use('/api', productRoutes)
app.use('/api', categoryRoutes)
app.use('/api', ownerRoutes)


app.listen(3000, (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log('Listening on port 3000')
    }
})