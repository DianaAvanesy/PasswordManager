/**
 * This is the model for the aticles(cards that you can find in the News page)
 */

//create a model the same way 
const mongoose = require('mongoose');

const schemaDefinition = {
    title: {
        type: String,
        required: true
    },
    information:{
        type: String,
        required: true
    }
};


var articleSchema = new mongoose.Schema(schemaDefinition);
module.exports = mongoose.model('Article', articleSchema);
