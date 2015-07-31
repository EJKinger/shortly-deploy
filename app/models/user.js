// var db = require('../config');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var userSchema = mongoose.Schema({
  username: {type: String, index: {unique: true}},
  password: String
});

var User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

User.prototype.comparePassword = function(attemptedPassword, callback){
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    if (err){
      console.log('ERROR: ', err);
      callback(err);
    }
    else callback(null, isMatch);
  });
}

module.exports = User;