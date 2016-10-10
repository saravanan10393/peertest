var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/peerjs');

module.exports = {
    "User" : mongoose.model('User', require('./user.schema'))
}; 