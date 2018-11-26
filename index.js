const http = require('http');
const express = require('express');
const ical = require('ical-generator');
const moment = require('moment');
require('moment-timezone');
const getRestaurantPaths = require('./getRestaurantPaths');
const getMenu = require('./getMenu');
const parseMenuItems = require('./parseMenuItems');
const mekumaFilter = require('./mekumaFilter');
const cache = require('./cache');
const config = require('./config');

const app = express();
app.set('view engine', 'ejs');

app.get('/mekuma.ics', cache(config.cache, 'text/calendar'), async (req, res) => {
	const cal = ical({
		domain: 'mekuma.herokuapp.com',
		prodId: { company: 'mekuma', product: 'ical-generator' },
		name: 'Mekuma',
	});

	const restaurantPaths = await getRestaurantPaths(
		config.restaurantListPath,
		config.restaurantPathTemplate
	);
	const promises = restaurantPaths.map(async path => getMenu(path.url));
	const results = await Promise.all(promises);
	// restaurant -> date -> food
	const menuItems = parseMenuItems(results);
	const mekumas = mekumaFilter(menuItems);

	mekumas.forEach((mekuma) => {
		try {
			const start = moment(moment(mekuma.open).tz(config.tz).utc());
			const end = moment(moment(mekuma.close).tz(config.tz).utc());
			cal.createEvent({
				start,
				end,
				timestamp: moment(moment().tz(config.tz).utc()),
				summary: `Mekuma ${mekuma.restaurant.restaurant}`,
				location: `Unicafe ${mekuma.restaurant.restaurant}, ${mekuma.restaurant.address}, ${mekuma.restaurant.zip}, ${mekuma.restaurant.city}`, // eslint-disable-line max-len
			});
		} catch (e) {
			console.error(e);
		}
	});
	res.header('Content-Type', 'text/calendar');
	res.send(cal.toString());
});

app.get('/', cache(config.cache, 'text/html'), async (req, res) => {
	const restaurantPaths = await getRestaurantPaths(config.restaurantListPath, config.restaurantPathTemplate); // eslint-disable-line max-len
	const promises = restaurantPaths.map(async path => getMenu(path.url));
	const results = await Promise.all(promises);
	// restaurant -> date -> food
	const menuItems = parseMenuItems(results);
	const mekumas = mekumaFilter(menuItems);
	mekumas.sort((a, b) => a.open - b.open);
	res.render('index', { mekumas, config });
});

app.get('/menu.json', cache(config.cache, 'application/json'), async (req, res) => {
	const restaurantPaths = await getRestaurantPaths(config.restaurantListPath, config.restaurantPathTemplate); // eslint-disable-line max-len
	const promises = restaurantPaths.map(async path => getMenu(path.url));
	const results = await Promise.all(promises);
	// restaurant -> date -> food
	const menuItems = parseMenuItems(results);
	res.header('Content-Type', 'application/json');
	res.send(JSON.stringify(menuItems));
});

const server = http.createServer(app);

server.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`); // eslint-disable-line no-console
});

module.exports = { app, server };
