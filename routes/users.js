var express = require('express');
var router = express.Router();
var models = require('../models/models.js');
var Room = models.room;

/* GET users listing. */

router.post('/login', function(req, res, next) {
  if (req.body.password.length < 8) {
    res.status(303).send('Plz enter longer password');
  } else {
    res.status(200).send('such good password');

  }
})


router.post('/createRoom', function(req, res, next){

  var newRoom = new Room ({
    roomName: req.body.roomName,
    created: date(),
    hostName: req.user._id,
    longitude: req.body.longitude,
    latitude: req.body,latitude,
    attendees: [req.user.username]
  });
  newRoom.save(function(err) {
      if (err) {console.log(err);}

  });
})

module.exports = router;
