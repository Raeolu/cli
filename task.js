class Task {
    id;
    name;
    points;
    start;
    repeat_config;

    constructor(x) {
        this.id = x.id;

        if (typeof this.id === "string") {
            this.id = parseInt(this.id);
        }

        this.name = x.name;
        this.points = x.points;

        if (typeof this.points === "string") {
            this.points = parseInt(this.points);
        }

        this.start = x.start;

        if (typeof this.start === "string") {
            this.start = new Date(this.start);
        }

        this.repeat_config = x.repeat_config;
    }

    get_repeats(start, end) {
        if (start.getTime() < this.start.getTime()) start = this.start;

        return get_repeat(this.start, end, this.repeat_config);
    }

    get events() {
        return database.get(Event.name).filter(x => x.task_id === this.id);
    }

    get next() {
        return this.get_repeats_todo(new Date(), new Date("2024-11-01"))[0];
    }

    get done() {
        if (this.repeat_config.type === "once" && this.events.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    get filtered() {
        
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

class TaskRepeat {
    task;
    repeat;

    constructor(task, repeat) {
        this.task = task; this.repeat = repeat;
    }
}

function filter_todo(start, end) {
    let result = [];

    for (let task of database.get(Task.name)) {
        for (let repeat of task.get_repeats_todo(start, end)) {
            result.push(new TaskRepeat(task, repeat))
        }
    }

    return result.sort((x, y) => x.repeat.due - y.repeat.due);
}