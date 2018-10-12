const fetch = require('node-fetch');
const config = require('./config');
require('format-unicorn');

const getRestaurantPaths = async (path, template) => {
	try {
		const res = await fetch(config.restaurantListPath);
		const json = await res.json();
		const list = json.data.map(r => ({
			...r,
			url: template.formatUnicorn({ restaurantId: r.id }),
		}));
		return list;
	} catch (e) {
		console.error(e);
		return null;
	}
};

module.exports = getRestaurantPaths;
