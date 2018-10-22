const fetch = require('node-fetch');
require('format-unicorn');

const getRestaurantPaths = async (path, template) => {
	try {
		const res = await fetch(path);
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
