function get_repeat(start, end, repeat_config) {
    let current = start.getTime();
    let repeats = [];
    let week = 1;
    let month = 1;
    let year = 1;

    while (current < end.getTime()) {
        daily(repeats, current, repeat_config);
        week = weekly(repeats, current, repeat_config, week);
        month = monthly(repeats, current, repeat_config, month);
        year = yearly(repeats, current, repeat_config, year);

        current += DAY;

        let current_date = new Date(current);

        if (current_date.getDay() === 0) {
            week++;
        }

        if (current_date.getDate() === 1) {
            month++;

            if (current_date.getMonth() === 0) {
                year++;
            }
        }
    }

    return repeats;
}

function daily(repeats, current, repeat_config) {
    if (repeat_config.type !== "daily") return;

    repeats.push(new Repeat({
        create: new Date(current),
        due: new Date(current)
    }));
}

function weekly(repeats, current, repeat_config, week) {
    if (repeat_config.type !== "weekly") return;

    if (week >= 1) {
        if (repeat_config.weekdays) {
            for (const weekday of repeat_config.weekdays) {
                repeats.push(new Repeat({
                    create: get_week_start(current),
                    due: get_day_in_week(current, weekday)
                }));
            }
        }
        else {
            repeats.push(new Repeat({
                create: get_week_start(current),
                due: get_week_end(current)
            }));
        }

        week--;
    }

    return week;
}

function monthly(repeats, current, repeat_config, month) {
    if (repeat_config.type !== "monthly") return;

    if (month >= 1) {
        repeats.push(new Repeat({
            create: get_month_start(current),
            due: get_month_end(current),
        }))

        month--;
    }

    return month;
}

function yearly(repeats, current, repeat_config, year) {
    if (repeat_config.type !== "yearly") return;

    if (year >= 1) {
        repeats.push(new Repeat({
            create: get_month_start(current),
            due: get_month_end(current),
        }))
        year--;
    }
}

class Repeat {
    create;
    due;

    constructor(repeat) {
        this.create = new Date(repeat.create);
        this.due = new Date(repeat.due);
    }

    toString() {
        return `${this.create.pretty()} - ${this.due?.pretty()}`;
    }
}