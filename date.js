const DAY = 24 * 3600 * 1000;

const SUN = 0;
const MON = 1;
const TUE = 2;
const WED = 3;
const THU = 4;
const FRI = 5;
const SAT = 6;

function get_week_end(date) {
    return get_day_in_week(date, 6);
}

function get_week_start(date) {
    return get_day_in_week(date, 0);
}

function get_day_in_week(date, weekday) {
    if (typeof date === "number") date = new Date(date)

    let startingDay = date.getDay();

    let offset = weekday - startingDay;

    return new Date(date.getTime() + DAY * offset);
}

function get_month_end(date) {
    date = new Date(date);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date;
}

function get_month_start(date) {
    date = new Date(date);
    date.setDate(1);
    return date;
}

Date.prototype.pretty = function() {
    let till = this.daysUntil(new Date());

    if (till === 0) {
        return "vandaag";
    }

    if (till === 1) {
        return "morgen";
    }

    if (till > 1 && till < 7) {
        return this.toLocaleString("nl-NL", {
            weekday: "long",
        });
    }

    return this.toLocaleString("nl-NL", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}

Date.prototype.daysUntil = function() {
    let now = new Date();
    
    let diff = this.getTime() - now.getTime();

    let diffDate = new Date(diff);

    let days = diffDate.getTime() / DAY;

    return Math.ceil(days);
}

Date.prototype.sameDay = function(date) {
    return this.getFullYear() === date.getFullYear() &&
        this.getMonth() === date.getMonth() &&
        this.getDate() === date.getDate();
}