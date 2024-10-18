//task 1 done
//task filter name *test

let task_s = /task \w*/;
let task_create_s = /task create /;
let task_create_repeat_s = /task create \w* \d* /;
let task_id_s = /task \d* \w*/;
let task_id_points_s = /task \d* points \d*/;
let task_id_delete_s = /task \d* delete/;
let task_id_repeat_s = /task \d* repeat (once|inf|daily|weekly|monthly)( \d\d\d\d-\d\d-\d\d)*/;
let task_id_start_s = /task \d* start( \d\d\d\d-\d\d-\d\d)*/;
let task_id_copy_s = /task \d* copy/;
let task_id_done_s = /task \d* done /;

let task_filter_todo_s = /task filter todo/;
let task_filter_done_s = /task filter done/;
let task_filter_name_s = /task filter name \w*/;

let event_id_delete_s = /event \d* delete/;
let event_id_points_s = /event \d* points \d*/;

let suggestion_list = [
    [task_s, suggestion_task],
    [task_create_s, suggestion_task_create],
    [task_id_s, suggestion_task_id],
    [task_id_done_s, suggestion_task_id_done],
];

function get_command_last_argument(command) {
    if (!command) return "";

    let arguments = command.split(" ");

    return arguments[arguments.length - 1];
}

function get_suggestion(command) {
    let suggestions = [];
    let argument = get_command_last_argument(command);

    try {
        for (const s of suggestion_list) {
            let match = command.match(s[0]);

            if (match && match[0] === command) {
                suggestions = s[1](command);
                break;
            }
        }

        return suggestions
            .filter(x => x.startsWith(argument))
            .map(x => x.substring(argument.length, x.length));
    } catch (e) {
        console.log(e);
    }

    return "";
}

function suggestion_task(command) {
    return ["filter", "copy", "create", "[id]"];
}


function suggestion_task_id(command) {
    return ["points", "delete", "repeat", "copy", "done", "start"];
}

function suggestion_task_create(command) {
    return ["[name] [points] [repeat]"];
}

function today() {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function suggestion_task_id_done(command) {
    return [today()];
}

function get_suggestion_task_filter(parts) {
    let parsed = parse_parts(parts);

    if (!parsed.any) return "";

    let options = [...Object.keys(database.tasks[0])];

    return options
        .filter(x => x.startsWith(parsed.current))
        .map(x => x.substring(parsed.current.length, x.length));
}