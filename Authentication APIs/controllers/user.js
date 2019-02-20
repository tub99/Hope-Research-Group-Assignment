const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = require('../models/user').model;
const ErrorCodes = require('../config/errorCodes');
const Callbacks = require('../common/callbacks');
const Utils = require('../common/utils');
const Constants = require('../config/constants');
const ObjectID = require('mongodb').ObjectID;
const uuidv1 = require('uuid/v1');


class User {
    constructor() {

    }

    /**
     * POST api/v1/account/signup
     * Create a new employee account.
     */
    signup(req, res, next) {
        // Validate incoming req data
        req.assert('name', 'name is not required');
        req.assert('email', 'Email is not valid').isEmail();
        req.sanitize('email').normalizeEmail({
            gmail_remove_dots: false
        });

        req.getValidationResult().then(result => {
            if (result.isEmpty()) {
                // find whether user with same email already exists
                UserModel.findOne({
                    email: req.body.email
                }, (err, existingUser) => {
                    if (err) {
                        // DB err
                        return Callbacks.InternalServerError(err, res);
                    }
                    if (existingUser) {
                        // user with same email already exists: send err
                        return Callbacks.SuccessWithError('Account with that email address already exists.', res);
                    }
                    // create user and encrypt Password
                    const user = new UserModel({
                        email: req.body.email,
                        password: Utils.encryptPassowrd(req.body.password),
                        name: req.body.name
                    });
                    // save the user
                    user.save((err) => {
                        if (err) {
                            return Callbacks.InternalServerError(err, res);
                        }
                        const response = user.response();
                        //User added successfully
                        return Callbacks.SuccessWithData('User added successfully!', response, res);


                    });
                });

            } else {
                //Req Validation error
                const errors = result.array();
                return Callbacks.ValidationError(errors[0].msg || 'Validation error', res);
            }
        });
    }

    /**
     * POST api/v1/account/signin
     * Signin user: employee/manager.
     */
    signin(req, res, next) {
        // Validate incoming req data
        req.assert('password', 'Password is required');
        req.sanitize('email').normalizeEmail({
            gmail_remove_dots: false
        });

        req.getValidationResult().then(result => {
            if (result.isEmpty()) {
                const email = req.body.email;
                const password = req.body.password;
                // find whether user with same email  exists or not
                UserModel.findOne({
                    email: req.body.email
                }, (err, existingUser) => {
                    if (err || !existingUser) {
                        // user dosen't exist in DB
                        return Callbacks.SuccessWithError('User not found', res);
                    }
                    if (existingUser) {
                        const passwordValidation =
                            existingUser.password === Utils.decryptPassword(existingUser.password, password);

                        if (!passwordValidation) {
                            return Callbacks.SuccessWithError('Password is invalid', res);
                        } else {
                            return Callbacks.SuccessWithData('Sign In successful', existingUser.response(), res)
                        }
                    }
                });
            } else {
                //Validation error
                const errors = result.array();
                return Callbacks.ValidationError(errors[0].msg || 'Validation error', res);
            }
        });
    }

    /**
      * PUT api/v1/account/resetPassword
      * Update current password.
      */
    resetPassword(req, res, next) {
        // Validate incoming req data
        const email = req.query.email;
        if (!email) return Callbacks.ValidationError('User Email Required', res);

        req.assert('password', 'Password is required');
        req.getValidationResult().then(result => {
            if (result.isEmpty()) {
                UserModel.findOne({
                    email: req.query.email
                }, (err, user) => {
                    if (err) {
                        return Callbacks.InternalServerError(err, res);
                    }
                    // store updated password in encrypted form
                    user.password = Utils.encryptPassowrd(req.body.password);
                    user.isPassWordReset = true;
                    user.save((err) => {
                        if (err) {
                            return Callbacks.InternalServerError(err, res);
                        }
                        return Callbacks.Success('Password Reset Successful', res);
                    });
                });
            } else {
                //Validation error
                const errors = result.array();
                return Callbacks.ValidationError(errors[0].msg, res);
            }
        }).catch(err => {
            return Callbacks.InternalServerError(err, res);
        });
    }

    /**
  * POST api/v1/account/resetPassword
  * Update current password.
  */
    forgotPassword(req, res, next) {

        const email = req.query.email;
        if (!email) return Callbacks.ValidationError('User Email Required', res);

        req.getValidationResult().then(result => {
            if (result.isEmpty()) {
                UserModel.findOne({
                    email: req.query.email
                }, (err, user) => {
                    if (err) {
                        return Callbacks.InternalServerError(err, res);
                    }
                    // store updated password in encrypted form
                    const updatedPassword = `forgot_${uuidv1()}`;
                    user.password = updatedPassword;
                    user.isPassWordReset = true;
                    user.save((err) => {
                        if (err) {
                            return Callbacks.InternalServerError(err, res);
                        }
                        const response = { 'newPassword': updatedPassword }
                        return Callbacks.SuccessWithData('Forgotten  password has been reset and sent', response, res);
                    });
                });
            } else {
                //Validation error
                const errors = result.array();
                return Callbacks.ValidationError(errors[0].msg, res);
            }
        }).catch(err => {
            return Callbacks.InternalServerError(err, res);
        });
    };

}

const userController = new User();

module.exports = userController;