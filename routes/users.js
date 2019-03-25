var router = require('express').Router();

var User = require('../models/User');

router.get('/', function(req, res) {
  res.render('users/index.html');
});

router.get('/registration', function(req, res) {
  res.render('users/registration.html');
});

router.get('/confirmation', function(req, res) {
  res.render('users/confirmation.html');
});

router.post('/newUser', function(req, res) {
  // create a user a new user
  var newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

// save user to database
  newUser.save({}, function(err, user) {
    if (err)
        res.send(err);
    User.find(function(err, leuser) {
        if (err)
            res.send(err);
        res.json(leuser);
    });
  });
});

router.post('/connectUser', function(req, res) {
  var coUser = new User({
    username : req.body.username,
    password : req.body.password
  });

    // attempt to authenticate user
  User.getAuthenticated('jmar777', 'Password123', function(err, user, reason) {
    if (err) throw err;

    // login was successful if we have a user
    if (user) {
        // handle login success
        console.log('login success');
        return;
    }

    // otherwise we can determine why we failed
    var reasons = User.failedLogin;
    switch (reason) {
        case reasons.NOT_FOUND:
        case reasons.PASSWORD_INCORRECT:
            // note: these cases are usually treated the same - don't tell
            // the user *why* the login failed, only that it did
            break;
        case reasons.MAX_ATTEMPTS:
            // send email or otherwise notify user that account is
            // temporarily locked
            break;
    }
  });



module.exports = router;