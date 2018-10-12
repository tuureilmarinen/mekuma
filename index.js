const http = require('http')
const express = require('express')
const app = express()
//const bodyParser = require('body-parser')
const cors = require('cors')
const ical = require('ical-generator');

const moment = require('moment');
//const fetch = require("node-fetch");
const getRestaurantPaths = require('./getRestaurantPaths');
const getMenu = require('./getMenu');
const parseMenuItems = require('./parseMenuItems');
const mekumaFilter = require('./mekumaFilter');


const config = {port: 9005, restaurantListPath:'https://messi.hyyravintolat.fi/publicapi/restaurants', restaurantPathTemplate: 'https://messi.hyyravintolat.fi/publicapi/restaurant/{restaurantId}'}

// https://messi.hyyravintolat.fi/publicapi/restaurant/9

// https://messi.hyyravintolat.fi/publicapi/restaurants

app.get('/mekuma.ical', async (req,res) => {
    const cal = ical({
        domain: 'mekuma.herokuapp.com',
        prodId: {company: 'mekuma', product: 'ical-generator'},
        name: 'Mekuma',
        timezone: 'Europe/Helsinki'
    });

    const restaurantPaths = await getRestaurantPaths(config.restaurantListPath, config.restaurantPathTemplate);
    const promises = restaurantPaths.map(async path => getMenu(path.url));
    const results = await Promise.all(promises)
    // restaurant -> date -> food
    const menuItems = parseMenuItems(results);
    const mekumas = mekumaFilter(menuItems);

    mekumas.forEach(mekuma => {
        try {
            const start = moment(mekuma.open);
            const stop = moment(mekuma.close);
            cal.createEvent({
                start,
                stop,
                timestamp: moment(),
                summary: "Mekumahekuma",
                location: `Unicafe ${mekuma.restaurant.restaurant}, ${mekuma.restaurant.address}, ${mekuma.restaurant.zip}, ${mekuma.restaurant.city}`
            })
        } catch (e) {
            console.error(e);
            debugger;
        }
    });

    res.send(cal.toString());
});


const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

module.exports = {
  app, server
}