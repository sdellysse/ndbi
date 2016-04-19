const getDriverNameFromDsn = function (dsn) {
    return dsn.split(":")[0];
};

module.exports = getDriverNameFromDsn;
