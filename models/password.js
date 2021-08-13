const mongoose = require('mongoose');
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; 
const contextService = require('request-context');
const encryptionHelper = require('../helpers/encryption.js');

const schemaDefinition = {
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    website: {
        type: String
    },
    userName: {
        type: String
    },
    userPassword:{
        type: String,
        required: true
    }
};

var passwordSchema = new mongoose.Schema(schemaDefinition);

passwordSchema.pre('findOneAndUpdate', function (next) {

    var userAccountPassword = encryptionHelper.getEncKey();
    //If user is using github and doesnt have a password app will use userId to encrypt password entities
    if(userAccountPassword == null || userAccountPassword == ''){
        userAccountPassword = this._update.userId;
    }
    const initVector = userAccountPassword.toString().repeat(16).substr(0, 16);
    const Securitykey = userAccountPassword.toString().repeat(32).substr(0, 32);

    const message = this._update.userPassword;

    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    this._update.userPassword = encryptedData;

    next();
})

passwordSchema.pre('save', async function(next) {

    var userAccountPassword = encryptionHelper.getEncKey();
    if(userAccountPassword == null || userAccountPassword == ''){
        userAccountPassword = this.userId;
    }

    const initVector = userAccountPassword.toString().repeat(16).substr(0, 16);
    const Securitykey = userAccountPassword.toString().repeat(32).substr(0, 32);

    const message = this.userPassword;
    console.log("======>",initVector, Securitykey);
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    this.userPassword = encryptedData
    next();
})

passwordSchema.post('init', async function() {
    var userAccountPassword = encryptionHelper.getEncKey();
    console.log("======>userPassword",userAccountPassword);
   if(userAccountPassword == null || userAccountPassword == ''){
           
    userAccountPassword = this.userId;
    }
   
    const Securitykey = userAccountPassword.toString().repeat(32).substr(0, 32);
    const initVector = userAccountPassword.toString().repeat(16).substr(0, 16);
    console.log("======>init",initVector, Securitykey, userAccountPassword);
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    
    let decryptedData = decipher.update(this.userPassword, "hex", "utf-8");

    decryptedData += decipher.final('utf8');
    this.userPassword = decryptedData
});

module.exports = mongoose.model('Password', passwordSchema);
