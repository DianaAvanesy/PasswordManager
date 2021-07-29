const mongoose = require('mongoose');

const schemaDefinition = {
    userId:{
        type: String,
        required: true
    },
    userName: {
        type: String
    },
    userPassword:{
        type: String
    }
};

var passwordSchema = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model('Password', passwordSchema);
