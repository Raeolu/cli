//task 1 done
//task filter name *test

let commands = {
    task: (arg) => {
        let task_commands = {
            create: task_create,
        };

        for (let t of database.tasks.map(x => x.id)) {
            task_commands[t] = task_id(t);
        }

        console.log("task", arg)

        if (task_commands[arg] !== undefined) {
            return task_commands[arg];
        }

        return [
            ...Object.keys(task_commands).filter(x => x.includes(arg))
        ];
    },
    event: (arg) => {

    },
};

function task_create(arg) {
    console.log("task create", arg)
}

function task_id(id) {
    return function (arg) {
        console.log(id);
    }
}

function command(arg) {
    console.log("command", arg)

    if (commands[arg.trim()] !== undefined) {
        return commands[arg.trim()];
    }

    return [
        ...Object.keys(commands).filter(x => x.includes(arg))
    ];
}