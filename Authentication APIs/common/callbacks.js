const ErrorCodes = require('../config/errorCodes');
// Utility functions to customize error and Sucessful Responses
exports.Success = (message, res) => {
    var json = {};
    json.status = '1';
    json.result = {'message': message}
    res.send(json);
}

exports.SuccessWithData = (message, data, res) => {
    var json = {};
    json.status = '1';
    json.result = {'message': message, 'data': data}
    res.send(json);
}

exports.SuccessWithError = (message, res) => {
    var json = {};
    json.status = '0';
    json.result = {'message': message}
    res.send(json);
}

exports.Failed = (errorCode, message, res) => {
    res.status(errorCode).send({
        code: 400,
        error: message
    });
}

exports.ValidationError = (message, res) => {
    res.status(ErrorCodes.VALIDATION_ERROR).json({
        code: ErrorCodes.VALIDATION_ERROR,
        error: message
    });
}

exports.InternalServerError = (error, res) => {
    let statusCode = (!error.statusCode) ? ErrorCodes.INTERNAL_SERVER_ERROR : error.statusCode;
    res.status(statusCode).json({
        code: statusCode,
        error: error.message || error.msg || error || 'Internal server error'
    });
}

exports.NotExistError = (message, res) => {
    res.status(ErrorCodes.NOT_EXIST).json({
        code: ErrorCodes.NOT_EXIST,
        error: message
    });
}

exports.NotAuthorizedError = (message, res) => {
    res.status(ErrorCodes.NOT_AUTHORIZED).json({
        code: ErrorCodes.NOT_AUTHORIZED,
        error: message
    });
}

exports.AlreadyExistError = (message, res) => {
    res.status(ErrorCodes.EMAIL_ALREADY_TAKEN).json({
        code: ErrorCodes.EMAIL_ALREADY_TAKEN,
        error: message
    });
}