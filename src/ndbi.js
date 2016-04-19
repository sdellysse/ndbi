const ConnectionManager = require("./connection-manager");
const DriverManager = require("./driver-manager");
const getDriverNameFromDsn = require("./get-driver-name-from-dsn");

const Ndbi = function (connectionOptionsOrDsn, username, password, options) {
    if (connectionOptionsOrDsn instanceof ConnectionManager) {
        const connectionOptions = connectionOptionsOrDsn;
        this.connectionOptions = connectionOptions;
    } else {
        const dsn = connectionOptionsOrDsn;
        this.connectionOptions = new ConnectionOptions(dsn, username, password, options);
    }

    const driverName = getDriverNameFromDsn(this.connectionOptions.dsn);
    this.Driver = this.constructor.driverManager.getDriver(driverName);
    this.connection = new this.Driver(this.connectionOptions);
};

Object.assign(Ndbi, {
    driverManager: new DriverManager(),
});

Object.assign(Ndbi.prototype, {
    constructor: Ndbi,

    getConnection: function () {
        return this.connection;
    },

    prepare: function (sql, driverOptions) {
        if (driverOptions == null) {
            driverOptions = {};
        }

        //TODO
    },
});

module.exports = Ndbi;
