const http = require('http')
const express = require('express')
const app = express()
//const bodyParser = require('body-parser')
const cors = require('cors')
const ical = require('ical-generator');
const ejs = require('ejs');

const moment = require('moment');
require('moment-timezone');
//const fetch = require("node-fetch");
const getRestaurantPaths = require('./getRestaurantPaths');
const getMenu = require('./getMenu');
const parseMenuItems = require('./parseMenuItems');
const mekumaFilter = require('./mekumaFilter');
const cache = require('./cache');


const config = {
    port: process.env.PORT || 9000,
    restaurantListPath: process.env.RESTAURANT_LIST_URL || 'https://messi.hyyravintolat.fi/publicapi/restaurants',
    restaurantPathTemplate: process.env.RESTAURANT_URL_TEMPLATE || 'https://messi.hyyravintolat.fi/publicapi/restaurant/{restaurantId}',
    cache: process.env.CACHE || 5,
    tz: process.env.TZ || 'Europe/Helsinki',
};


app.set('view engine', 'ejs');

// https://messi.hyyravintolat.fi/publicapi/restaurant/9

// https://messi.hyyravintolat.fi/publicapi/restaurants

app.get('/mekuma.ics', cache(config.cache, "text/calendar"), async (req,res) => {
    const cal = ical({
        domain: 'mekuma.herokuapp.com',
        prodId: {company: 'mekuma', product: 'ical-generator'},
        name: 'Mekuma',
        //timezone: 'Europe/Helsinki'
    });

    const restaurantPaths = await getRestaurantPaths(config.restaurantListPath, config.restaurantPathTemplate);
    const promises = restaurantPaths.map(async path => getMenu(path.url));
    const results = await Promise.all(promises)
    // restaurant -> date -> food
    const menuItems = parseMenuItems(results);
    const mekumas = mekumaFilter(menuItems);

    mekumas.forEach(mekuma => {
        try {
            const start = moment(moment(mekuma.open).tz(config.tz).utc())
            const end = moment(moment(mekuma.close).tz(config.tz).utc())
            cal.createEvent({
                start,
                end,
                timestamp: moment(moment().tz(config.tz).utc()),
                summary: `Mekuma ${mekuma.restaurant.restaurant}`,
                location: `Unicafe ${mekuma.restaurant.restaurant}, ${mekuma.restaurant.address}, ${mekuma.restaurant.zip}, ${mekuma.restaurant.city}`
            })
        } catch (e) {
            console.error(e);
            debugger;
        }
    });
    res.header("Content-Type", "text/calendar");
    res.send(cal.toString());
});

//app.get('/', cache(config.cache, "text/html"), async (req,res) => {
app.get('/', async (req,res) => {
    const restaurantPaths = await getRestaurantPaths(config.restaurantListPath, config.restaurantPathTemplate);
    const promises = restaurantPaths.map(async path => getMenu(path.url));
    const results = await Promise.all(promises)
    // restaurant -> date -> food
    const menuItems = parseMenuItems(results);
    const mekumas = mekumaFilter(menuItems);
    mekumas.sort((a,b)=>a.open-b.open);
    res.render('index', {mekumas});
});

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

module.exports = {
  app, server
}