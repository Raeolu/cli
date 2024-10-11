class Task {
    id;
    name;
    points;
    start;
    repeat_config;

    constructor(x) {
        this.id = x.id;
        this.name = x.name;
        this.points = x.points;
        this.start = x.start;
        this.repeat_config = x.repeat_config;
    }

    get_repeats(start, end) {
        if (start.getTime() < this.start.getTime()) start = this.start;

        return get_repeat(this.start, end, this.repeat_config);
    }

    get events() {
        return database.events.filter(x => x.frozen_task.id === this.id);
    }

    get next() {
        return this.get_repeats_todo(new Date(), new Date("2024-11-01"))[0];
    }

    get_repeats_todo(start, end) {
        let result = [];

        for (let repeat of this.get_repeats(start, end)) {
            let completed = false;

            for (let event of this.events) {
                if (repeat.due?.sameDay(event.repeat_date)) {
                    completed = true;
                    break;
                }
            }

            if (!completed) result.push(repeat);
        }

        return result;
    }
}

function filter_todo(start, end) {
    let result = [];

    for (let task of database.tasks) {
        for (let repeat of task.get_repeats_todo(start, end)) {
            result.push({task, repeat})
        }
    }

    return result.sort((x, y) => x.repeat.due - y.repeat.due);
}