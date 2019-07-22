var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose')
var User = mongoose.model('User');
// const db = require("./../models");


//serializeUser allows passport to save the users id (or other information if we define after done) into the session upon login
passport.serializeUser((user, done) => {
    console.log('INSIDE passport.serializeUser in config/passport.js')
    console.log(user);
    done(null, user.id)
});

//deserializeUser upon login go to the database and fetch the users info based upon the id
passport.deserializeUser((id, done) => {
    console.log(id);
    User.findById(id, (err, user) => {
        //Once the sign login is successful, the "user" object below will be available globally 
        done(err, user)
    })
});

//Sign up passport strategy
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {

        if (err) {
            console.log('Error in findOne function checking for existing user')
            return done(err);
        }
        //if the user exists already
        if (user) {
            console.log('User returned from findOne passport.use(local-signup)');
            console.log("The user " + user.email + " already exists");
            req.flash('alreadyExists', 'This user already exists!')
            return done(null, false)
        }


        var newUser = new User();
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save(err => {
            err ? done(err) : null;
            //if user is successfully created/saved send back the data via the "done" call back carrying the "newUser" obj
            return done(null, newUser)
        })
    })
}))





//Login passport strategy
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }

        //in this strategy we're checking to see if the user does not exist
        if (!user) {
            console.log("this user does not exist")
            const err = new Error('User Email Not Found!')
            err.statusCode = 401
            return done(err, false)
        }
        //if user does exist we'll check to ensure their password is correct
        if (!user.validPassword(password)) {
            console.log("login rejected: incorrect password")

            //after installing connect flash we'll send back error message

            const err = new Error('Incorrect Password!')
            err.statusCode = 403
            return done(err, false)
        }
        //if they do exist and their password is correct we'll return the "user" object via the "done" call back function
        console.log('password/username was correct')
        // debugger
        return done(null, user)
    })
}))