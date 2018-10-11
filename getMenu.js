const fetch = require('node-fetch');
const getMenu = async (path) => {
    try {
        const res = await fetch(path);
        const json = await res.json();
        return json;
    } catch (e) {
        console.error(e);
        return null
    }
}
module.exports = getMenu;