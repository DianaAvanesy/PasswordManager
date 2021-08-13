//create a model the same way 
const mongoose = require('mongoose');
//inject athentication related functions by injecting the passport module
const plm = require('passport-local-mongoose');

const schemaDefinition = {
    username: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
};

var userSchema = new mongoose.Schema(schemaDefinition);

//use plugin to add funct to the model
//this expans the model to offer athen related functionality
userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
