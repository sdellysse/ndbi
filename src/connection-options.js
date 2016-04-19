const ConnectionOptions = function (dsn, username, password, options) {
    if (typeof dsn !== "string") {
        throw new InvalidDSNException(dsn, "must be string");
    }
    this.dsn = dsn;

    if (username == null) {
        this.username = null;
    } else if (typeof username === "string") {
        this.username = username;
    } else {
        throw new InvalidUsernameError(username, "must be string or null/undefined");
    }

    if (password == null) {
        this.password = null;
    } else if (typeof password === "string") {
        this.password = password;
    } else {
        throw new InvalidPasswordError(password, "must be string or null/undefined");
    }

    if (options == null) {
        this.options = {};
    } else {
        this.options = {};
    }
};

module.exports = ConnectionOptions;
