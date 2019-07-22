var passport = require('passport');
// var router = require('express').Router();
const db = require("./../models");


const UserControllers = module.exports = {
    findById: (req, res) => {
        console.log(req.params.id);
        db.User
            .findById(req.params.id)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },

    beforeLogin: (req, res, next) => {
        console.log(`inside the login function "userController.js" with req.body.email = ${req.body.email}, 
    right before passport.authenticate`);
        next();
    },

    login: (req, res, next) => {
         console.log('Inside login controller');
         console.log(res);
         console.log('\n');
        passport.authenticate('local-login', {
            session: true
        }, (err, user) => {
            err ? next(err) : req.session.user = user;
            next();
        })(req, res, next)
    },

    logout: (req, res) => {
        console.log(req.user)
        req.logout();
        req.session.user = null
        console.log(req.user)
        res.json({
            redirect: "/",
            logged_out: true
        })
    },

    signup: (req, res, next) => {
        console.log('Inside signup controller');
        console.log(req.body)
        console.log('\n');
        passport.authenticate('local-signup', {
            session: true
        }, (err, user) => {
            console.log('Inside error callback in signup controller');
            console.log(err)
            console.log('\n');
            err ? next(err) : next();
        })(req, res, next)
    },

    //this function will return our session info
    getSession: (req, res, next) => {
        console.log('Inside getSession controller');
        console.log(req.session)
        console.log('\n');
        req.session.user ? () => {
            const userInfo = {
                email: req.session.user.email,
                id: req.session.user._id
            }
            res.json({
                // TODO Don't expose sensitive data
                user: userInfo,
                authenticated: true
            })
        } : res.json({
                user: null,
                authenticated: false
            })
    },

    isLoggedIn: (req, res, next) => {
        console.log('Inside isLoggedIn controller');
        console.log(res)
        console.log('\n');
        req.session ? next(res) : () => {
            console.log('must login first!')
            const err = new Error("You have to log in first");
            err.statusCode = 403
        };
    },

    checkApiAuthentication: (req, res, next) => {
        // Check for public routes (e.g. login/session etc)
        // And then validate the authenticated routes
        const publicRoutes = [
            "/user/login",
            "/user/signup",
            "/user/session",
        ]
        publicRoutes.includes(req.url) ? next() : console.log('URL does not match public routes for Authentication')
        UserControllers.isLoggedIn(req, res, next);
    },

    update: (req, res) => {
        console.log(req.body);
        const updatedUserInfo = req.body;
        db.User.findOneAndUpdate({ _id: updatedUserInfo._id }, updatedUserInfo)
            .then(dbModel => {
                res.json(dbModel)
            })
            .catch(err => {
                res.status(422).json(err)
            });
    },

    updateUserDataArray: (req, res) => {
        console.log(req.body)
        console.log(req.session.user._id)
        db.User.findOneAndUpdate({ _id: req.session.user._id },
            { $push: { data: req.body } })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }


};