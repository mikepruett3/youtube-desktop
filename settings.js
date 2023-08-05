// settings.js

const Store = require('electron-store');
const store = new Store();

function getHA () {
    const ha = store.get("ha")
    return ha
}

function setHA (status) {
    store.set("ha", status)
    return status
}

module.exports = {
    getHA: getHA,
    setHA: setHA
}