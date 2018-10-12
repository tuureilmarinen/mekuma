const mcache = require('memory-cache');

const cache = (duration, type) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            if(type){
                res.header("Content-Type", type);
            }
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            }
            next();
        }
    }
}

module.exports = cache;