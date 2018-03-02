var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var User = require("./models/user");
var Register = require("./models/register");
var methodOverride = require("method-override");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");


//requiring routes
var userRegisterRoutes = require("./routes/index");



//set ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));

var url = process.env.DATABASEURL || "mongodb://localhost/t4solutionsnewa";
mongoose.connect(url);

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "The Secret Place",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// using routes
app.use(userRegisterRoutes);

//root




//handle sign up logic
// app.post("/signup", function(req, res){
//     req.body.password;
//     req.body.email;
//     var newUser = new User({username: req.body.username});
//     User.register(newUser, req.body.password,req.body.email, function(err, user){
//         if(err){
//             console.log(err);
//             //req.flash("error", err.message);
//                 return res.render("signup", {error:err.message});
//         }
//         passport.authenticate("local")(req, res, function(){
//             //console.log(user);
//             req.flash("success", "Thanks for registering!");
//             res.redirect("/");
//         })
//     })
// });






//Display All Registered User
// app.get("/registeredusers",function(req, res) {
//     //get all registered Users
//     Register.find({},function(err, allRegisteredUsers){
//         if(err){
//             console.log(err);
//         }else{
//           res.render("registeredusers", {allRegisteredUsersVar:allRegisteredUsers}) 
//         }
//     })
    
// });


// app.post("/registeredusers", function(req, res) {
//     //var msg = "mail sent"
//     //res.redirect("contact", {msg :msg})
//     var firstname = req.body.firstName;
//     var lastname = req.body.lastName;
//     //var email = req.body.email;
//     var phone = req.body.phone;
//     var gender = req.body.gender;
//     var location = req.body.location;
//     var gender = req.body.gender;
//     var location_other = req.body.location_other;
//     var bus_stop = req.body.bus_stop;
//     var pickupTime = req.body.pickupTime;
//     var comment = req.body.comment;
//     var newRegisteredUser = {firstname : firstname, lastname:lastname, phone:phone, gender:gender,location_other:location_other,
//         bus_stop :bus_stop, pickupTime:pickupTime,comment:comment
//     };
//     Register.create(newRegisteredUser, function(err, newlyCreated){
//         if(err){
            
//             console.log(err)
//         }else{
//             res.redirect("registeredusers");
//         }
//     })
    
//     console.log(req.body)
    
//     // create reusable transporter object using the default SMTP transport
    
//     // let transporter = nodemailer.createTransport({
//     //     host: 'gator4267.hostgator.com',
//     //     //port: 587,
//     //     port: 465,
        
//     //     //secure: false, // true for 465, false for other ports
//     //     secure: true,
//     //     auth: {
//     //         user: "info@triangulah.com", // generated ethereal user
//     //         pass: "Jesus01234."  // generated ethereal password
//     //     }
//     // });

//     // setup email data with unicode symbols
    
//     // let mailOptions = {
//     //     from: '"NodeMailer Contact" <info@triangulah.com>', // sender address
//     //     to: 'tunde.oyewo@gmail.com, tunde_oyewo@yahoo.co.uk', // list of receivers
//     //     subject: 'Node Contact Request', // Subject line
//     //     text: 'Hello world?', // plain text body
//     //     //html: '<b>Hello world?</b>' // html body
//     //     html: output
       
//     // };

//     // send mail with defined transport object
//     // transporter.sendMail(mailOptions, (error, info) => {
//     //     if (error) {
//     //         return console.log(error);
//     //     }
//     //     console.log('Message sent: %s', info.messageId);
//     //     // Preview only available when sending through an Ethereal account
//     //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//     //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
//     //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     //      res.render("register", {output : output, msg : "Message sent"})
//     // });
// })









//middleWare

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "Please login First");
//     res.redirect("/login");
// }


function allowRegister(req, res, next){
    if(req.isAuthenticated() && currentUser._id === "5a93c16ab8016d0c30e0a883"){
        return next();
    }
        
    req.flash("error", "Permission denied");
    res.redirect("/");
}

//console.log(process.env.GMAILPW);
console.log(process.env.DATABASEURL);
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("transport app server started...");
})