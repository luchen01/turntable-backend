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

//User/DJ can create new room
router.post('/createroom', function(req, res, next){
  var newRoom = new Room ({
    description: req.body.description,
    roomName: req.body.roomName,
    created: Date.now(),
    hostName: req.user._id,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    attendees: [{spotifyId: req.user.spotifyId,
                name: req.user.username}]
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

//DJ can get all the play list in the current spotify account
router.get('/userplaylists', function(req, res, next) {
  axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: "Bearer " + req.user.access
    }
  })
  .then(function(resp) {
    res.send(resp.data);
  })
})

//DJ can choose the current spotify playlist as the queue
router.get('/playlisttracks', function(req, res, next) {
  axios.get("https://api.spotify.com/v1/users/" + req.user.spotifyId + "/playlists/" + req.body.playlistId + "/tracks", {
    headers: {
      Authorization: "Bearer " + req.user.access
    }
  })
  .then(function(resp) {
    res.send(resp.data.items);
  })
})

//User can join existing rooms
router.post('/joinroom/:roomId', function(req, res, next){
    Room.findById(req.params.roomId, function(error,results){
      if(error){
        res.send(error)
      }else{
        results.attendees.push({
          spotifyId: req.user.spotifyId,
          name: req.user.username
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
