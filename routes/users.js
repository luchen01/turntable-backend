var express = require('express');
var router = express.Router();
var models = require('../models/models.js');
var Room = models.room;

/* GET users listing. */
//if user is not logged in, redirect to login page
// router.use(function(req, res, next){
//   if (!req.user) {
//     res.redirect('/');
//   } else {
//     return next();
//   }
// });

router.post('/login', function(req, res, next) {
  if (req.body.password.length < 8) {
    res.status(303).send('Plz enter longer password');
  } else {
    res.status(200).send('such good password');

  }
})

//User/DJ can create new room
router.post('/createroom', function(req, res, next){
  var newRoom = new Room ({
    description: req.body.description,
    roomName: req.body.roomName,
    created: Date.now(),
    hostName: req.user._id,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    attendees: [req.user.username]
  });
  console.log("newRoom", newRoom);
  newRoom.save(function(err) {
    if(err){
      res.send(err)
    }else{
      console.log('saved!');
      // res.send('Saved!')
      res.redirect('/')
  }
});
});

//User can join existing rooms
router.post('/joinroom/:roomId', function(req, res, next){
    Room.findById(req.params.roomId, function(error,results){
      if(error){
        res.send(error)
      }else{
        results.attendees.push({
          spotifyId: '000',
          name: 'Luchen',
          song: ''
        });
        results.save(function(err){
          if(err){console.log(err);
          }else{
            res.send("JOINED ROOM")
          }
        })
      }
    });
});

module.exports = router;
