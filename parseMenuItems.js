const parseDate = str =>
    (str.split(" "))[1].split(".").reverse().join("-")+"-"+(new Date()).getFullYear();

const parseWeekday = str =>
    str.split(" ")[0]

module.exports = (data) => {
    const items = [];
    data.map((restaurant)=>{
        restaurant.data.map(date=>{
            try {
                const time = parseDate(date.date);
                const weekday = parseWeekday(date.date);

                const hours = restaurant.information.lounas.regular.find(hours=>hours.when.includes(weekday))
                if(!hours) return;
                const open = Date.parse(time + " " + hours.open);
                const close = Date.parse(time + " " + hours.close);
                date.data.map(food=>{
                    const menuItem = {
                        ...food,
                        restaurant: restaurant.information,
                        date: time,
                        open,
                        close,
                        
                    }
                    items.push(menuItem);
                })
            }
            catch (e) {
                console.error(e);
                debugger
            }
        })
    });
    return items;
}