var mongo = require('mongoose'),
Schema = mongo.Schema;

var userSchema = new Schema({
    username: String,
    googleId: String
});