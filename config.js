const config = {
	port: process.env.PORT || 9000,
	restaurantListPath: process.env.RESTAURANT_LIST_URL || 'https://messi.hyyravintolat.fi/publicapi/restaurants',
	restaurantPathTemplate: process.env.RESTAURANT_URL_TEMPLATE || 'https://messi.hyyravintolat.fi/publicapi/restaurant/{restaurantId}',
	cache: process.env.CACHE || 5,
	tz: process.env.TZ || 'Europe/Helsinki',
	redis: process.env.REDIS_URL,
	trackingId: process.env.TRACKING_ID,
};

module.exports = config;
