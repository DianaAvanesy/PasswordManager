/**
 * This is the model for the password records that users can create in the app
 * This models also deals with encryption and decription of the passwords
 */

const mongoose = require('mongoose');
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; 
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


/**
 * Pre(findOneAndUpdate) encrypts the password BEFORE it will get written in the DB with the help of findOneAndUpdate
 */
passwordSchema.pre('findOneAndUpdate', function (next) {

    //Extract the key from encryptionHelper
    //Note: The key will be only awailible if User login NOT via github
    var userAccountPassword = encryptionHelper.getEncKey();

    //If user is using github and doesnt have a password  we will use userId to encrypt password entities
    if(userAccountPassword == null || userAccountPassword == ''){
        userAccountPassword = this._update.userId;
    }

    //In both cases make sure that the lenght is 16 or 32
    const initVector = userAccountPassword.toString().repeat(16).substr(0, 16);
    const Securitykey = userAccountPassword.toString().repeat(32).substr(0, 32);

    //password that will get encrypted
    const message = this._update.userPassword;

    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    //assign the encrypted password to the data that will be used to update record
    this._update.userPassword = encryptedData;

    next();
})

/**
 * Pre(save) encrypts the password BEFORE it will get created in the DB with the help of save
 */
passwordSchema.pre('save', async function(next) {

    //Extract the key from encryptionHelper
    //Note: The key will be only awailible if User login NOT via github
    var userAccountPassword = encryptionHelper.getEncKey();

    //If user is using github and doesnt have a password  we will use userId to encrypt password entities
    if(userAccountPassword == null || userAccountPassword == ''){
        userAccountPassword = this.userId;
    }

    //In both cases make sure that the lenght is 16 or 32
    const initVector = userAccountPassword.toString().repeat(16).substr(0, 16);
    const Securitykey = userAccountPassword.toString().repeat(32).substr(0, 32);

    //password that will get encrypted
    const message = this.userPassword;
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    //assign the encrypted password to the data that will be used to save the record
    this.userPassword = encryptedData
    next();
})

/**
 * Post(init) decrypt the password after the object is initilized
 */
passwordSchema.post('init', async function() {

    //Extract the key from encryptionHelper
    //Note: The key will be only awailible if User login NOT via github
    var userAccountPassword = encryptionHelper.getEncKey();

    //If user is using github and doesnt have a password we will use userId to encrypt password entities
   if(userAccountPassword == null || userAccountPassword == ''){   
        userAccountPassword = this.userId;
    }

   //In both cases make sure that the lenght is 16 or 32
    const Securitykey = userAccountPassword.toString().repeat(32).substr(0, 32);
    const initVector = userAccountPassword.toString().repeat(16).substr(0, 16);

    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    
    let decryptedData = decipher.update(this.userPassword, "hex", "utf-8");

    decryptedData += decipher.final('utf8');
    
    //assign the decrypted password to the model
    this.userPassword = decryptedData
});

module.exports = mongoose.model('Password', passwordSchema);
