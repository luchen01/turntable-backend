var express = require('express');
var router = express.Router();
var passport = require('passport');
var models = require('../models/models.js');
var User = models.user;
const SpotifyStrategy = require('passport-spotify').Strategy;


//Configure spotify strategy and passport
passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/spotify/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ spotifyId: profile.id, accessToken: accessToken }, function (err, user) {
      return done(err, user);
    });
    // console.log("returning from spotify", accessToken, refreshToken, profile);
    // return done(null, profile)
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/auth/spotify',
  passport.authenticate('spotify'),
  function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

//Use passport.authenticate(), specifying the 'spotify' strategy, to authenticate requests.
router.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

//registration and login
// function validate(req){
//   req.checkBody('username', 'Invalid Username').notEmpty();
//   req.checkBody('password', 'Invalid password').notEmpty();
// };

//encrypt password
var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

router.post('/register', function(req, res){
  // validate(req);
  // var errors = req.validationErrors();
  // if(errors){
  //   res.send(errors)
  // }else{
  //
  // });
  var newUser = new User({
    username: req.body.username,
    password: hashPassword(req.body.password),
  })
  newUser.save(function(error){
    if(error){
      res.send(error)
    }else{
      console.log('saved!');
      // res.send('Saved!')
      res.redirect('/')
    }
  })
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
})

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
