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
    var access = accessToken;
    User.findOne({
          spotifyId: profile.id
      }, function(err, user) {
      if (err) {return done(err);}
//No user was found... so create a new user with values from Facebook (all the profile. stuff)
      if (!user) {
          user = new User({
            username: profile.displayName,
            profilePhoto: profile.photos[0],
            access: access,
            spotifyId: profile.id,
            provider: 'spotify',
            //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //found user. Return
            console.log('new access', access);
            return done(err, user);
        }
  });

})
)

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
  });

//Use passport.authenticate(), specifying the 'spotify' strategy, to authenticate requests.
router.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


//encrypt password
var crypto = require('crypto');
function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

router.post('/register', function(req, res){
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
