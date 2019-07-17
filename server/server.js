const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const routes = require('./routes');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config;
require('./config/passport');


// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

//using the store: new MongoStore creates a new colection in our dB to store the sessions info (cookie)
//this way the web browser refresh will not delete it
app.use(session({
  secret: 'mysecretsessionkey',
  resave: true,
  saveUninitialized: true,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(flash());
// Incorporate PASSPORT
app.use(passport.initialize());
app.use(passport.session());


// Add routes, both API and view
app.use(routes);

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/data-arc';

// Connect to the Mongo DB
mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);

// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
