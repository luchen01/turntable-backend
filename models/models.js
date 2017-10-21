var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);
var Schema = mongoose.Schema;


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
    songName: String,
    songId: String,
    vote: Array
});


var userModel = mongoose.model('User', userSchema);
var roomModel = mongoose.model('Room', roomSchema);
var playlistModel = mongoose.model('Playlist', playlistSchema);


module.exports = {
  User: userModel,
  Room: roomModel,
  Playlist: playlistModel
};
