let saved = JSON.parse(window.localStorage.getItem("database") ?? "{}");

window.database = new Database(saved);

database.listen(Task.name, (update) => {
    update_stuff();
});

database.listen(Event.name, (update) => {
    update_event(update);
});

function update_stuff() {
    clear_items(Task.name);
    clear_items(TaskRepeat.name);
    
    for (let task of database.get(Task.name)) {
        update_item({action: "add", item: task});
    }

    for (let task_repeat of filter_todo(new Date("2024-10-01"), new Date("2024-10-20"))) {
        update_item({action: "add", item: task_repeat});
    }
}

function update_event(update) {
    clear_items(Event.name);
    clear_items(TaskRepeat.name);

    if (update) {
        let task = database.get(Task.name, update.item.task_id)[0];

        update_item({action: "update", item: task});
    }

    for (let event of database.get(Event.name)) {
        update_item({action: "add", item: event});
    }

    let start_date = database.get(Task.name).map(x => x.start).sort((a, b) => a - b);
    
    console.log(start_date);

    for (let task_repeat of filter_todo(new Date("2024-10-01"), new Date("2024-10-20"))) {
        update_item({action: "add", item: task_repeat});
    }
}

update_stuff();
update_event();