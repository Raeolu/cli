function task_create(input) {
    let parts = input.split(" ");

    let [/*task*/, /*create*/, name, points, repeat, weekdays] = parts;
    points = parseInt(points) || 0;

    if (name === undefined) throw new Error("Invalid name");

    let id = database.id(Task.name);

    let repeat_config = { type: "once" };

    if (repeat !== undefined) {
        repeat_config.type = repeat;
    }

    if (weekdays !== undefined) {
        repeat_config.weekdays = weekdays.split(",").map(x => parseInt(x));
    }

    let start = new Date();

    let task = new Task({
        id,
        name,
        points,
        repeat_config,
        start
    });

    database.add(task);
}

function task_id_points(input) {
    let parts = input.split(" ");

    let [/*task*/, id, /*points*/, points] = parts;
    id = parseInt(id);
    points = parseInt(points) || 0;

    if (id === NaN) throw new Error("Invalid id");

    let task = database.get(Task.name, id)[0];

    if (!task) throw new Error(`No task with id ${id}`);

    task.points = points;

    database.update(task);
}

function task_id_name(input) {
    let parts = input.split(" ");

    let [/*task*/, id, /*name*/, name] = parts;
    id = parseInt(id);

    if (id === NaN) throw new Error("Invalid id");

    let task = database.get(Task.name, id)[0];

    if (!task) throw new Error(`No task with id ${id}`);

    task.name = name;

    database.update(task);
}

function task_id_delete(input) {
    let parts = input.split(" ");
    
    let [/*task*/, id, /*delete*/] = parts;
    id = parseInt(id);

    if (id === NaN) throw new Error("Invalid id");

    database.remove(Task.name, id);
}

function task_id_repeat(input) {
    let parts = input.split(" ");

    let [/*task*/, id, /*repeat*/, repeat, start] = parts;
    id = parseInt(id);

    if (typeof start === "string") {
        start = new Date(start);
    } else {
        start = start ?? new Date();
    }

    if (id === NaN) throw new Error("Invalid id");
    if (!start) throw new Error("Invalid start");

    let task = database.get(Task.name, id)[0];
    task.repeat_config = {
        type: repeat
    };
    task.start = start;

    database.update(task);
}

function task_id_start(input) {
    let parts = input.split(" ");

    let [/*task*/, id, /*start*/, start] = parts;
    id = parseInt(id);

    if (typeof start === "string") {
        start = new Date(start);
    } else {
        start = start ?? new Date();
    }

    if (id === NaN) throw new Error("Invalid id");
    if (!start) throw new Error("Invalid start");

    let task = database.get(Task.name, id)[0];
    task.start = start;

    database.update(task);
}

function task_id_copy(input) {
    let parts = input.split(" ");

    let [/*task*/, id, /*start*/, start] = parts;
    id = parseInt(id);

    if (id === NaN) throw new Error("Invalid id");

    let task = database.get(Task.name, id)[0];

    let copy_args = {...task};
    copy_args.id = database.id(Task.name);

    let copy = new Task(copy_args);
    database.add(copy);
}

function task_id_done(input) {
    let parts = input.split(" ");

    let [/*task*/, id, /*done*/, date] = parts;
    id = parseInt(id);

    if (typeof date === "string") {
        date = new Date(date);
    } else {
        date = date ?? new Date();
    }

    if (id === NaN) throw new Error("Invalid id");
    if (!date) throw new Error("Invalid date");

    let task = database.get(Task.name, id)[0];

    if (!task) throw new Error(`No task found with id ${id}`);

    let event = new Event({
        id: database.id(Event.name),
        task_id: task.id,
        date: new Date(),
        repeat_date: date,
        frozen_task: {
            points: task.points
        }
    });

    database.add(event);
}

function task_filter_todo(input) { }
function task_filter_done(input) { }

function task_filter_name(input) {

}