var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/login', function(req, res, next) {
//   res.send('Send');
// }

router.post('/login', function(req, res, next) {
  if (req.body.password.length < 8) {
    res.status(303).send('Plz enter longer password');
  } else {
    res.status(200).send('such good password');

  }
})

module.exports = router;
