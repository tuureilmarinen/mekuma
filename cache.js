const mcache = require('memory-cache');

const cache = (duration, type) => (req, res, next) => {
	const key = `__express__${req.originalUrl}` || req.url;
	const cachedBody = mcache.get(key);
	if (cachedBody) {
		if (type) {
			res.header('Content-Type', type);
		}
		res.send(cachedBody);
	} else {
		res.sendResponse = res.send;
		res.send = (body) => {
			mcache.put(key, body, duration * 1000);
			res.sendResponse(body);
		};
		next();
	}
};

module.exports = cache;
