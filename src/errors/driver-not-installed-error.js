"use strict";

const DriverNotInstalledError = function (driverName) {
    this.name = 'DriverNotInstalledError';
    this.message = `Driver "${ driverName }" is not installed`;
    this.stack = (new Error()).stack;

    this.driverName = driverName;
};
DriverNotInstalledError.prototype = Object.create(Error.prototype);
DriverNotInstalledError.constructor = DriverNotInstalledError;

module.exports = DriverNotInstalledError;
