const redis = require('async-redis');
const config = require('./config');

const client = redis.createClient(config.redis);

const cache = (duration, type) => async (req, res, next) => {
	const key = `__express__${req.originalUrl}` || req.url;
	const cachedBody = await client.get(key);
	if (cachedBody) {
		if (type) {
			res.header('Content-Type', type);
		}
		res.send(cachedBody);
	} else {
		res.sendResponse = res.send;
		res.send = async (body) => {
			await client.set(key, body);
			res.sendResponse(body);
		};
		next();
	}
};

module.exports = cache;
