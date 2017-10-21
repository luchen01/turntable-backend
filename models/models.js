var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);
var Schema = mongoose.Schema;
// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!

var userSchema = new Schema({
  profilePhoto:String,
  username: String,
  password: String,
  spotifyId: String,
  access: String,
  song: String,
  roomName: String
});

var roomSchema = new Schema({
  roomName: String,
  created: Date,
  // hostName: String,
  host: {
    spotifyId:String,
    name: String,
  },
  longitude: String,
  latitude: String,
  attendees: [{
    spotifyId: String,
    name: String
  }],
  description: String,
  tracks: String
});

var playlistSchema = new Schema({
  song: [{
    songName: String,
    songId: String,
    vote: Array
  }]
});

// Step 2: Create all of your models here, as properties.
var userModel = mongoose.model('User', userSchema);
var roomModel = mongoose.model('Room', roomSchema);
var playlistModel = mongoose.model('Playlist', playlistSchema);

// Step 3: Export your models object
module.exports = {
  User: userModel,
  Room: roomModel,
  Playlist: playlistModel
};
