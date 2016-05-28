"use strict";

const DriverManager = require("./driver-manager");
const DriverNotInstalledError = require("./errors/driver-not-installed-error");
const InvalidDsnError = require("./errors/invalid-dsn-error");
const InvalidPasswordError = require("./errors/invalid-password-error");
const InvalidUsernameError = require("./errors/invalid-username-error");
const UnknownDriverError = require("./errors/unknown-driver-error");

const Ndbi = function (dsn, username, password, options) {
    if (typeof dsn !== "string") {
        throw new InvalidDsnError(dsn, "must be string");
    }
    if (dsn.indexOf(":") === -1) {
        throw new InvalidDsnError(dsn, "must have driver specification");
    }
    this.driverName = dsn.split(":")[0];
    this.driverString = dsn.split(":").slice(1).join(":");

    if (username === void(0)) {
        username = null;
    }
    if (username !== null && typeof(username) !== "string") {
        throw new InvalidUsernameError(username, "must be string or null/undefined");
    }
    this.username = username;

    if (password === void(0)) {
        password = null;
    }
    if (password !== null && typeof(password) !== "string") {
        throw new InvalidPasswordError(password, "must be string or null/undefined");
    }
    this.password = password;

    if (options === null || options === void(0)) {
        options = {};
    }
    this.options = options;
};

Object.assign(Ndbi, {
    DriverManager,
    driverManager: new DriverManager(),

    errors: {
        DriverNotInstalledError,
        InvalidDsnError,
        InvalidPasswordError,
        InvalidUsernameError,
        UnknownDriverError,
    },
});

Object.assign(Ndbi.prototype, {
    beginTransaction: function () {
        return this.getDriver()
        .then(driver => {
            if (driver.beginTransaction) {
                return driver.beginTransaction();
            } else {
                return this.execute("BEGIN");
            }
        })
        ;
    },

    commit: function () {
        return this.getDriver()
        .then(driver => {
            if (driver.commit) {
                return driver.commit();
            } else {
                return this.execute("COMMIT");
            }
        })
        ;
    },

    driverP: null,
    getDriver: function () {
        if (!this.driverP) {
            this.driverP =
                this.constructor.driverManager.getDriver(driverName)
                .then(Driver => new Driver(driverString, username, password, options))
            ;
        }

        return this.driverP;
    },

    connect: function () {
        return this.getDriver()
        .then(driver => driver.connect())
        ;
    },
    constructor: Ndbi,

    disconnect: function () {
        return this.getDriver()
        .then(driver => driver.disconnect())
        ;
    },

    execute: function (sql, params, driverOptions) {
        return this.getDriver()
        .then(driver => {
            if (params == null) {
                params = [];
            }
            if (driverOptions == null) {
                driverOptions = {};
            }
            if (driver.execute) {
                return driver.execute(sql, params, driverOptions);
            } else {
                return this.query(sql, params, driverOptions);
            }
        })
        ;
    },

    lastInsertId: function (catalog, schema, table, field) {
        return this.getDriver()
        .then(driver => {
            if (typeof(catalog) === "undefined") {
                catalog = null;
            }
            if (typeof(schema) === "undefined") {
                schema = null;
            }
            if (typeof(table) === "undefined") {
                table = null;
            }
            if (typeof(field) === "undefined") {
                field = null;
            }

            return driver.lastInsertId(catalog, schema, table, field);
        })
        ;
    },

    prepare: function (sql, driverOptions) {
        return this.getDriver()
        .then(driver => {
            if (driverOptions == null) {
                driverOptions = {};
            }

            return driver.prepare(sql, driverOptions);
        })
        ;
    },

    query: function (sql, params, driverOptions) {
        return this.getDriver()
        .then(driver => {
            if (params == null) {
                params = [];
            }
            if (driverOptions == null) {
                driverOptions = {};
            }

            if (driver.query) {
                return driver.query(sql, params, driverOptions);
            } else {
                return driver.prepare(sql, driverOptions)
                .then(stmt => {
                    stmt.execute(params);
                    return stmt;
                })
                ;
            }
        })
        ;
    },

    rollback: function () {
        return this.getDriver()
        .then(driver => {
            if (driver.rollback) {
                return driver.rollback();
            } else {
                return this.execute("ROLLBACK");
            }
        })
        ;
    },

    transaction: function (promisor) {
        return this.getDriver()
        .then(driver => {
            if (driver.transaction) {
                return driver.transaction(promisor);
            } else {
                return this.beginTransaction()
                .then(promisor)
                .then(value => {
                    return this.commit()
                    .then(() => value)
                    ;
                })
                .catch(error => {
                    return this.rollback()
                    .then(() => Promise.reject(error))
                    ;
                })
                ;
            }
        })
        ;
    },
});

module.exports = Ndbi;
