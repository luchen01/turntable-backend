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
  username: String,
  password: String,
  spotifyId: String,
  song: String,
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room'
  }
});

userSchema.statics.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
    this.findOne({_id : profile.id},function(err,result){
        if(!result){
            userObj.username = profile.displayName;
            //....
            userObj.save(cb);
        }else{
            cb(err,result);
        }
    });
};

var roomSchema = new Schema({
  roomName: String,
  created: Date,
  hostName: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  longitude: String,
  latitude: String,
  attendees: Array

});

var playlistSchema = new Schema({
  created: Date,
  content: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref:'User'
  },
  contact: {
    type: mongoose.Schema.ObjectId,
    ref:'Contact'
  },
  channel: String,
  status: String,
  from: String
});

// Step 2: Create all of your models here, as properties.
var userModel = mongoose.model('user', userSchema);
var roomModel = mongoose.model('room', roomSchema);
var playlistModel = mongoose.model('playlist', playlistSchema);

// Step 3: Export your models object
module.exports = {
  user: userModel,
  room: roomModel,
  playlist: playlistModel
};
