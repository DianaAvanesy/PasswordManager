
/**
 * This helper is responsible for storing encryption key through the session 
 *  And be acessible in the models
 */
var _encryptionKey = ""

exports.getEncKey = function() {
  return _encryptionKey;
};

exports.setEncKey = function(encryptionKey) {
  _encryptionKey = encryptionKey;
};

exports.cleanEncKey = function() {
    _encryptionKey = "";
  };
  