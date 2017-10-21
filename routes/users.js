var express = require('express');
var router = express.Router();

/* GET users listing. */

router.post('/login', function(req, res, next) {
  if (req.body.password.length < 8) {
    res.status(303).send('Plz enter longer password');
  } else {
    res.status(200).send('such good password');

  }
})

// router.post('/register', function(req, res) {
//   // validation step
//   var error = validateReq(req.body);
//   if (error) {
//     res.send(error)
//   }
//   var u = new models.User({
//     username: req.body.username,
//     password: req.body.password,
//   });
//   u.save(function(err, user) {
//     if (err) {
//       console.log(err);
//       res.status(500).redirect('/signup');
//       return;
//     }
//     console.log("Saved User: ", user);
//     res.redirect('/login');
//   });
// });

module.exports = router;
