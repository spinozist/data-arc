var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



const userSchema = mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    email: { type: String },
    password: { type: String },
    data: { type: [Object], require: false },
});

userSchema.methods.encryptPassword = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

//this method is used to compare the password being input by the user to that in the database
//we pass the "password" argument to this function when we call it from the passport config file
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}


// gooddeedsdb
module.exports = mongoose.model('User', userSchema);
