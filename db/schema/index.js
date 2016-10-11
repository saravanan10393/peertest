var mongoose = require('mongoose');

var url = "mongodb://"+process.env.dbUser+":"+process.env.dbPassword+"@ds055626.mlab.com:55626/peerjs";
mongoose.connect(url);

module.exports = {
    "User" : mongoose.model('User', require('./user.schema'))
}; 