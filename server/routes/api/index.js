const router = require("express").Router();
const userRoutes = require('./user');
const userController = require("../../controllers/userControllers")

// back end authentication check from any API
router.use(userController.checkApiAuthentication) // userController.checkApiAuthentication.bind(userController)

//User routes
router.use("/user", userRoutes);

module.exports = router;
