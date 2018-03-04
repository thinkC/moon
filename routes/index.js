var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Register = require("../models/register");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");


//root route
router.get("/", function(req,res) {
    console.log(req.user);
    res.render("landing", {currentUser : req.user});
});

//================
//AUTH ROUTES
//================
router.get("/register", function(req, res){
    res.render("register");
});


//sigup/register new user
router.post("/register", function(req, res){
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
          
                   //send mail after registerinh
            
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
        subject: 'Thanks for Registering!',
        text: 'Thanks for registering. We will contact you soon!\n\n'
          
          //'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        //done(err, 'done');
      });
          
          
          
          
          
            res.redirect("/");
            // res.redirect("/", {newVar : newUser});
        })
    })
});



//Login Route
router.get("/login", function(req, res){
    res.render("login");
    // res.send("login");
});


//handling Login Logic
router.post("/login",passport.authenticate("local",

{
    successRedirect: "/",
    failureRedirect : "/login",
    // failureFlash: "Invalid username or password!"
    failureFlash: true,
    successFlash: 'Welcome to T4Solutions!'  
}), function(req, res) {
    
})

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/login");
   
})



//Get all users from DB
router.get("/registeredusers",allowRegister, function(req, res) {
  if(req.query.search){
     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    User.find({locations : regex}, function(err, allRegisteredUsers){
      if(err){
        console.log(err);
      }else{
        res.render("registeredusers",{allRegisteredUsersVar:allRegisteredUsers} )
      }
    })
  }else{
    User.find({}, function(err, allRegisteredUsers){
      if(err){
        console.log(err);
      }else{
        res.render("registeredusers",{allRegisteredUsersVar:allRegisteredUsers} );
      }
    })
  }
})


//show more info on each Registered User
router.get("/register/:id", function(req, res) {
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

//Edit Registration
router.get("/register/:id/edit", function(req, res) {
    User.findById(req.params.id, function(err, foundUsers){
        if(err){
            console.log(err);
        }else{
            res.render("edit", {registerVar : foundUsers});
        }
    })
    
});


//Update Registration
router.put("/register/:id", function(req, res){
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
router.delete("/register/:id", function(req, res){
   User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/registeredusers");
        }else{
            res.redirect("/registeredusers");
        }
    })
    
})


// about page
router.get("/about", function(req, res) {
    res.render("about");
});

//contact us page
router.get("/contact", function(req, res) {

    res.render("contact");
});

router.post("/contact", function(req, res, next) {
  
    var user = req.body.name;
    var company = req.body.company;
    var email = req.body.email;
    var phone = req.body.phone;
    var message = req.body.message;
    var output = `
    <p>You have a new contact request</p>
    <h3>Contct details </h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Emai: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>message</h3>
    <p>${req.body.message}</p>
    
    `
                     //send mail after the submit button in contact form
            
        var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'enovativeng@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        //to: user.email,
        to: 'enovativeng@gmail.com',
        // from: 'enovativeng@gmail.com',
        from: email,
        subject: 'RE:Thanks for your mail',
        text: 'Thanks foremail. We will contact you soon!\n\n',
        html: output
          
          //'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        //done(err, 'done');
      });
      
  //console.log(req.body);
    res.render("contact");
    
})

//contact us page
router.get("/blog", function(req, res) {
    res.render("blog");
});

//forgot password
router.get("/forgot", function(req, res) {
    res.render("forgot");
});

router.post('/forgot', function(req, res, next) {
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
        subject: 'Password Reset',
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


router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
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

//middleware
function allowRegister(req, res, next){
    if(req.isAuthenticated() && req.user._id == "5a99b940f4dea027831887dd" || req.isAuthenticated() && req.user._id =="5a93c16ab8016d0c30e0a883"){
        return next();
    }
    req.flash("error", "Please login First");
    res.redirect("/login");
}


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;