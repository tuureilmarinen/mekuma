const zeropad = require('zeropad');

const parseDate = str => `${(str.split(' '))[1].split('.').reverse().join('-')}-${(new Date()).getFullYear()}`;

const parseWeekday = str => str.split(' ')[0];

module.exports = (data) => {
	const items = [];
	data.forEach((restaurant) => {
		restaurant.data.forEach((date) => {
			try {
				const time = parseDate(date.date);
				const weekday = parseWeekday(date.date);

				const hours = restaurant.information.lounas.regular.find(x => x.when.includes(weekday));
				if (!hours) return;
				const openHour = hours.open.replace('.', ':');
				const closeHour = hours.close.replace('.', ':');
				const open = Date.parse(`${time} ${openHour}`);
				const close = Date.parse(`${time} ${closeHour}`);
				date.data.forEach((food) => {
					const menuItem = {
						...food,
						restaurant: restaurant.information,
						date: time,
						open,
						close,
						openHour,
						closeHour,

					};
					items.push(menuItem);
				});
			} catch (e) {
				console.error(e);
			}
		});
	});
	return items;
};
