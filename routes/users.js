var express = require('express');
var router = express.Router();
var models = require('../models/models.js');
var axios = require('axios');
var User = models.User;
var Room = models.Room;
var Playlist = models.Playlist;

var crypto = require('crypto');
function hashPassword(password){
  console.log(password);
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};

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
    hostName: req.user.spotifyId,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    attendees: [{spotifyId: req.user.spotifyId,
                name: req.user.username}],
    tracks: req.body.playlistId
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

router.get('/allrooms', function(req, res, next){
  Room.find(function(error, results){
    res.send(results)
  });
})

router.post('/getUser', function(req, res, next){
  User.findOne({username: req.body.username, password: hashPassword(req.body.password)}, function(error, results){
    if(error){
      res.send(error)
    }else{
      res.send(results)
    }
  })
});

//DJ can get all the play list in the current spotify account
router.post('/userplaylists', function(req, res, next) {
  User.findOne({spotifyId: req.body.spotifyId}, function(error, results){
    if(error){
      res.send(error)
    }
    if(!results){
      res.send("Need to have a spotify account")
    }
    else{
      axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: "Bearer " + results.access
        }
      })
      .then(function(resp) {
        // console.log("resp",resp);
        res.send(resp.data);
      })
  }
})
});

//DJ can choose the current spotify playlist as the queue
router.post('/playlisttracks', function(req, res, next) {
  axios.get("https://api.spotify.com/v1/users/12145188065/playlists/5KmBulox9POMt9hOt3VV1x", {
    headers: {
      Authorization: "Bearer " + req.body.access
    }
  })
  .then(function(resp) {
    console.log(resp)
    res.send(resp);
  })
})

//DJ can select playlist
// router.post('/selectplaylist/:playlistId', function(req, res,next){
//   Room.findById(req.body.roomId, function(error,results){
//     if(error){
//       res.send(error)
//     }else{
//       results.tracks =
// })

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
            User.findOne({username: req.user.username}, function(error, user){
              user.roomName = results.roomName;
              user.save(function(err){
                if(err){console.log(err)
                }else{
                  res.send(results)
                }
              })
            })
          }
        })
      }
    });
});

router.post('/songs', function(req, res, next){
  Room.findOne({roomName: req.body.roomName})
  .populate('tracks')
  .exec(function(err, room){
    if(err){res.send(err)
    }else{
    res.send(room.tracks)
  }
  })
})

router.post('/addsongs', function(req, res){
  var newSong = new Playlist({
    songName: req.body.songName,
    songId:req.body.songid ,
    vote:''
  })

  newSong.save();
  res.send('saved!')
})
//Like songs
router.post('/like', function(req, res, next){
  User.findOne({username: req.body.username}, function(error, results){
    if(error){
      res.send(error)
    }else{
      results.song = req.body.song;
      results.save(function(err){
        if(err){
          console.log(err);
        }else{
          res.send(results)
        }
      })
    }
  });
});

module.exports = router;
