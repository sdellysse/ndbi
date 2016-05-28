"use strict";

const InvalidPasswordError = function (password, reason) {
    this.name = 'InvalidPasswordError';
    this.message = `Invalid Password "${ password }", reason: "${ reason }"`;
    this.stack = (new Error()).stack;

    this.password = password;
    this.reason = reason;
};
InvalidPasswordError.prototype = Object.create(Error.prototype);
InvalidPasswordError.constructor = InvalidPasswordError;

module.exports = InvalidPasswordError;
