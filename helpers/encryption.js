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
  