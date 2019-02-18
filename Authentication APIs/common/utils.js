const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

// generate a salt reqd by md5 algo
exports.generateSalt = (password) => {
    var set = '0123456789abcd';
    var salt = '';
    for(var i = 0; i < 10; i++){
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
}

// using crypto module to create an md5 hash with digest
exports.md5 = (str) => {
    return crypto.createHash('md5').update(str).digest('hex');
}

//encrypt the password by user via a salt and md5 algo
exports.encryptPassowrd = (password) => {
    var salt = exports.generateSalt();
    var encryptedPassword = (salt + exports.md5(password + salt));
    return encryptedPassword;
}

// decryption happens via salt extracted from esisting stored password
// md5 takes that salt and provided password to generate the salt
exports.decryptPassword = (encrypt, password) => {
    var salt = encrypt.substr(0, 10);
    var decryptedPassword = salt + exports.md5(password + salt);
    return decryptedPassword;
}
// checking for valid mongo object Id
exports.isValidObjectId = (_id) => {
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

    if(!_id && _id === '' || _id.match(checkForHexRegExp) == null){
        return false;
    } else {
        return true;
    }
}
// These funcs checks for String/Object/Array
exports.isString = (value) => {
    return (typeof value === 'string')
}

exports.isObject = (value) => {
    return (typeof value === 'object')
}

exports.isArray = (value) => {
    return (Object.prototype.toString.call(value) === '[object Array]')
}

