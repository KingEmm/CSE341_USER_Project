const express = require('express');
const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
const mongodb = require('./db/connect');
const products = require('./routes/products');
const users = require('./routes/usersRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const session = require("express-session");
const passport = require('passport');

require("./config/passport");

require("dotenv").config();
const port = process.env.PORT || 8080;


const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app
.use(bodyParser.json())
.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})
.use('/users', users)
.use('/products', products)
.use('/auth', require("./routes/auth").router)
.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
.use((req, res) => {
    const err = new Error('Page Not Found');
    // err.status = 404;
    res.status(404).json({Message: err.message});
});


mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on http://localhost:${port}`);
  }
});
