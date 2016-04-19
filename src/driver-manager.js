const DriverManager = function () {
    this.drivers = {};

    [
        [ "postgres", "ndbi-driver-postgres" ],
        [ "mysql", "ndbi-driver-mysql" ],
    ].forEach(([ name, driver ]) => this.setDriver(name, driver));
};

Object.assign(DriverManager.prototype, {
    setDriver: function (name, driver) {
        this.drivers[name] = driver;
    },

    getDriver: function (name) {
        if (this.drivers[name] == null) {
            throw new UnknownDriverError(name);
        }
        if (typeof this.drivers[name] === "string") {
            let currentlyResolving;
            try {
                currentlyResolving = true;
                require.resolve(this.drivers[name]);
                currentlyResolving = false;

                this.drivers[name] = require(this.drivers[name]);
            } catch (e) {
                if (currentlyResolving === true) {
                    throw new InvalidDriverError(name);
                } else {
                    throw e;
                }
            }
        }

        return this.drivers[name];
    },
});
