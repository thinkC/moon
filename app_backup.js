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


//set ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/t4solutionsnewa");

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

app.get("/", function(req,res) {
    console.log(req.user);
    res.render("landing", {currentUser : req.user});
});

//================
//AUTH ROUTES
//================
app.get("/register", function(req, res){
    res.render("register");
});

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


//new code for this
app.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email:req.body.email,
        phone: req.body.phone,
        locations: req.body.locations,
        bus_stop:req.body.bus_stop,
        pickupTime: req.body.pickupTime,
        gender:req.body.gender,
        comment : req.body.comment
        
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            //req.flash("error", err.message);
                return res.render("register", {error:err.message});
        }
        passport.authenticate("local")(req, res, function(){
            //console.log(user);
            req.flash("success", "Thanks for registering!");
            console.log(newUser);
            res.redirect("/");
            // res.redirect("/", {newVar : newUser});
        })
    })
});

//Login Route
app.get("/login", function(req, res){
    res.render("login");
    // res.send("login");
});

//handling Login Logic
app.post("/login",passport.authenticate("local",

{
    successRedirect: "/",
    failureRedirect : "/login",
    // failureFlash: "Invalid username or password!"
    failureFlash: true,
    successFlash: 'Welcome to T4Solutions!'
}), function(req, res) {
    
})

//logout route
app.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/login");
   
})

//Get all users from DB
app.get("/registeredusers", function(req, res) {
    User.find({}, function(err, allRegisteredUsers){
      if(err){
        console.log(err);
      }else{
        res.render("registeredusers",{allRegisteredUsersVar:allRegisteredUsers} )
      }
    })
})

//show more info on each Registered User
app.get("/register/:id", function(req, res) {
    //find the Registered User with the provided ID
    User.findById(req.params.id,function(err, foundUsers) {
        if(err){
            console.log(err);
        }else{
            console.log(foundUsers);
            res.render("registeredusershow", {foundUsersVar:foundUsers});
        }
    })
});

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

//Edit Registration
app.get("/register/:id/edit", function(req, res) {
    User.findById(req.params.id, function(err, foundUsers){
        if(err){
            console.log(err);
        }else{
            res.render("edit", {registerVar : foundUsers});
        }
    })
    
});

//Update Registration
app.put("/register/:id", function(req, res){
    //find and update the correct user
    User.findByIdAndUpdate(req.params.id, req.body.register, function(err, updatedRegisteredUser){
        console.log(req.body.register)
      if(err){
        res.redirect("register")  
      }else{
          res.redirect("/register/" + req.params.id);
      }
    })
});

//Delete Registered User Route
app.delete("/register/:id", function(req, res){
   User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/registeredusers");
        }else{
            res.redirect("/registeredusers");
        }
    })
    
})

// about page
app.get("/about", function(req, res) {
    res.render("about");
});

// contact us page
app.get("/contact", function(req, res) {
    res.render("contact");
});

//forgot password
app.get("/forgot", function(req, res) {
    res.render("forgot");
});

app.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'enovativeng@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'enovativeng@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});


app.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'enovativeng@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'enovativeng@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});



//middleWare
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "Please login First");
//     res.redirect("/login");
// }

console.log(process.env.GMAILPW);
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("transport app server started...");
})