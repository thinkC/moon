var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// var UserSchema = new mongoose.Schema({
//     username: String,
//     password :String
// });
var UserSchema = new mongoose.Schema({
    username: {type: String, unique : true, required : true},
    password : String,
    firstName: String,
    lastName: String,
    email : {type : String, unique: true, required : true},
    phone : Number,
    locations : String,
    bus_stop : String,
    pickupTime : String,
    gender : String,
    comment : String,
    resetPasswordToken: String,
    resetPasswordExpires:Date
});
var option = {
    errorMessage:{
        IncorrectPasswordError : "Password is incorrect",
        IncorrectUsernameError : "Username is incorrect"
    }
};

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);