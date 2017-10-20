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
  spotifyId: String
});

var contactSchema = new Schema({
  name: String,
  phone: String,
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var messageSchema = new Schema({
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
var contactModel = mongoose.model('contact', contactSchema);
var messageModel = mongoose.model('message', messageSchema);

// Step 3: Export your models object
module.exports = {
  user: userModel,
  contact: contactModel,
  message: messageModel
};
