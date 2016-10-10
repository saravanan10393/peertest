var mongoose = require('mongoose');

var user = mongoose.Schema({
    email : String,
    password : String,
    name : String,
    status : {type:Boolean, Default : false}
});

user.set('toJSON', {
    virtuals: true
});

module.exports = user;