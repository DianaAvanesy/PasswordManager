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

    console.log(this);

    const userAccountPassword = encryptionHelper.getEncKey();
    const initVector = userAccountPassword.toString().repeat(16).substr(0, 16);
    const Securitykey = userAccountPassword.toString().repeat(32).substr(0, 32);

    console.log("==> updateOne:", initVector, Securitykey);

    const message = this._update.userPassword;

    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    this._update.userPassword = encryptedData;

    console.log("I shouldn't see you");
    next();
})

passwordSchema.pre('save', async function(next) {
    const userAccountPassword = encryptionHelper.getEncKey();
    const initVector = userAccountPassword.toString().repeat(16).substr(0, 16);
    const Securitykey = userAccountPassword.toString().repeat(32).substr(0, 32);

    console.log("==> Save:", initVector, Securitykey);

    const message = this.userPassword;

    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    this.userPassword = encryptedData
    next();
})

passwordSchema.post('init', async function() {
    const userAccountPassword = encryptionHelper.getEncKey();

    const Securitykey = userAccountPassword.toString().repeat(32).substr(0, 32);
    const initVector = userAccountPassword.toString().repeat(16).substr(0, 16);
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    
    let decryptedData = decipher.update(this.userPassword, "hex", "utf-8");

    decryptedData += decipher.final('utf8');

    console.log("Decrypted message: " + decryptedData);
    this.userPassword = decryptedData
});

module.exports = mongoose.model('Password', passwordSchema);
