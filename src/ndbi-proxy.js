const NdbiManager = require("./ndbi-manager");
const Ndbi = require("./ndbi");

const NdbiProxy = function () {
    const NdbiClass = NdbiProxy.manager.getNdbiClass();

    const retval = Object.create(NdbiClass.prototype);
    NdbiClass.apply(retval, arguments);

    return retval;
};

Object.assign(NdbiProxy, {
    manager: new NdbiManager(Ndbi);
});
