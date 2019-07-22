const router = require("express").Router();
var userController = require('./../../controllers/userControllers')

//API call for signup
router.route('/signup')
    .post(userController.signup,
        (err, req, res, next) => err ? next(err) : next(),
        // Success responses
        (req, res) => {
            console.log('Inside successful callback of post request in route.user.signup')
            console.log(req.session);
            // console.log(res);
            console.log('\n');

            //****** STUCK HERE *******
            res.json({
                success: true,
                redirect: "/"
            })        
        }
    );

//API call for login
router.route('/login')
    .post(
        // userController.beforeLogin,
        userController.login,
        // This will handle errors
        (err, req, res, next) => err ? next(err) : next(),
        // Success responses
        (req, res) => res.json({success: true, redirect: "/"})
    );


//API call will return session info to the front end
router.route("/session")
    .get(userController.getSession)

//API call for logout
router.route('/logout')
    .get(userController.logout);

router.route("/:id")
    .get(userController.findById);

router.route('/update')
    .put(userController.update);

router.route('/user-data')
    .post(userController.updateUserDataArray)


module.exports = router;
