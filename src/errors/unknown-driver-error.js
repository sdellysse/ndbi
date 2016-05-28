"use strict";

const UnknownDriverError = function (driverName) {
    this.name = 'UnknownDriverError';
    this.message = `Unknown Driver "${ driverName }"`;
    this.stack = (new Error()).stack;

    this.driverName = driverName;
};
UnknownDriverError.prototype = Object.create(Error.prototype);
UnknownDriverError.constructor = UnknownDriverError;

module.exports = UnknownDriverError;
