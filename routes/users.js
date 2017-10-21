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

//User/DJ can create new room
router.post('/createroom', function(req, res, next){
  var newRoom = new Room ({
    description: req.body.description,
    roomName: req.body.roomName,
    created: Date.now(),
    hostName: req.body.spotifyId,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    attendees: [{spotifyId: req.body.spotifyId}],
    tracks: req.body.playlistId
  });
  newRoom.save(function(err) {
    if(err){
      res.send(err)
    }else{
      // res.send('Saved!')
      res.send(newRoom);
  }
});
});

router.get('/allrooms', function(req, res, next){
  Room.find(function(error, results){
    res.send(results)
  });
});

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
});
});

//DJ can choose the current spotify playlist as the queue
router.post('/playlisttracks', function(req, res, next) {
  axios.get("https://api.spotify.com/v1/users/12145188065/playlists/5KmBulox9POMt9hOt3VV1x", {
    headers: {
      Authorization: "Bearer " + req.body.access
    }
  })
  .then(function(resp) {
    Playlist.find(function(err, results){
      res.send(results)
    })
})
});

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

router.get('/songs', function(req, res, next){
    var returnSongs;
    Playlist.find()
    .sort({'vote': -1})
    .exec(function(err, results){
      returnSongs = results.slice();
      for(var i = 0; i < returnSongs.length; i++){
        console.log(returnSongs[i].vote);
        returnSongs[i].voteNum = returnSongs[i].vote.length
      };
      returnSongs = returnSongs.sort(function(a,b){
        return b.voteNum - a.voteNum
      });
      return res.send(returnSongs)
    });

});

router.post('/addsongs', function(req, res){
  var newSong = new Playlist({
    songName: req.body.songName,
    songId:req.body.songid ,
    vote:''
  });
  newSong.save();
  res.send(newSong);
});

//Like songs
router.post('/like', function(req, res, next){
  // User.findOne({username: req.body.username}, function(error, results){
  //   if(error){
  //     res.send(error)
  //   }else{
  //     results.song = req.body.song;
  //     results.save(function(err){
  //       if(err){
  //         console.log(err);
  //       }else{
  //         res.send(results)
  //       }
  //     })
  //   }
  // })
  Playlist.findOne({songName: req.body.songName}, function(error, results){
    if(error){
      res.send(error)
    }else{
      console.log(results);
      results.vote.push(req.body.username);
      results.save(function(err){
        if(err){
          console.log(err);
        }else{
          res.send(results)
        }
      });

    }
  })
});

module.exports = router;
