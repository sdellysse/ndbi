"use strict";

// This is faked-async right now as once es6 module loading is finalized this
// will inevitably be an async operation.
const isModuleInstalled = function (requireString) {
    return new Promise((resolve, reject) => {
        try {
            require.resolve(requireString);
            resolve(true);
        } catch (e) {
            resolve(false);
        }
    });
};

module.exports = isModuleInstalled;
