var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

router.get('/login',(req,res)=>{
  res.render('login',{
  //  flag : false
  });
  //res.send('Hello World');
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: false })
);

router.get('/register',(req,res)=>{

  res.render('register',{
    //flag : false
  });
});

router.get('/logout',(req,res)=>{
  req.logout();
  req.session.destroy();
  res.redirect('/users/login');
});

router.post('/register',(req,res)=>{
  var username =  req.body.username;
  var password =  req.body.password;

	// Validation

	req.check('username', 'Username is required').notEmpty();
	req.check('password', 'Password is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
    console.log(errors);
		res.render('register',{
			error : errors

		});
	}
  else {
    console.log(`Username : ${username} \n Password : ${password}\n`);

    var user = new User({
        //_id: new mongoose.Types.ObjectId(),
        username : username ,
        password : password
    });

    User.createUser(user, function(err, user){
  			if(err) throw err;
  			console.log(user);
  		});
  		// req.flash('success_msg', 'You are registered and can now login')
  		res.redirect('/users/login');
    }
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        //console.log(bcrypt.compare(password,user.password));
        bcrypt.compare(password, user.password, function(err, res) {
          if(res) {
              return done(null, user);
          } else {
              return done(null, false, { message: 'Incorrect password.' });
        }
      });
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  function comparePassword(password,hash,next)
  {
    bcrypt.compare(password, hash, function(err, res) {
    if(err) throw err;
    return res;
  });
}

module.exports = router;
