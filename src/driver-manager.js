"use strict";

const DriverNotInstalledError = require("./errors/driver-not-installed-error");
const isModuleInstalled = require("./is-module-installed");
const UnknownDriverError = require("./errors/unknown-driver-error");

const DriverManager = function () {
    this.drivers = {};

    for (let [ name, driver ] of [
        [ "postgres", "ndbi-driver-postgres" ],
        [ "mysql", "ndbi-driver-mysql" ],
    ]) {
        this.setDriver(name, driver);
    }
};

Object.assign(DriverManager.prototype, {
    constructor: DriverManager,

    getInstalledDriverNames: function () {
        const driverNames = Object.keys(this.drivers);
        const promises = driverNames.map(isModuleInstalled);

        return Promise.all(promises).then(results => {
            var retval = [];
            for (let [i, result] of results) {
                if (result) {
                    retval.push(driverNames[i]);
                }
            }
            return retval;
        });
    },

    getDriver: function (name) {
        return new Promise((resolve, reject) => {
            if (this.drivers[name] === void(0)) {
                reject(new UnknownDriverError(name));
            }
            if (typeof this.drivers[name] === "string") {
                return isModuleInstalled(this.drivers[name])
                .then(installed => {
                    if (installed) {
                        this.drivers[name] = require(this.drivers[name]);
                        resolve(this.drivers[name]);
                    } else {
                        reject(new DriverNotInstalledError(name));
                    }
                })
                ;
            } else {
                resolve(this.drivers[name]);
            }
        });
    },

    setDriver: function (name, driver) {
        this.drivers[name] = driver;
    },

});

module.exports = DriverManager;
