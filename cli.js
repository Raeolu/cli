let cli = document.querySelector("#cli");
let input_el = document.querySelector("#input");

function focus_input() {
    input_el.focus();
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(input_el, input_el.childNodes.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function update_suggestion() {
    let input = input_el.innerText.replaceAll(/\s/g, " ");

    input_el.dataset.suggestion = get_suggestion(input);
}

document.body.addEventListener("keydown", e => {
    if (e.target === input_el) {
        return;
    }

    e.preventDefault();

    if (e.key === "Tab") {
        focus_input();
    }
});

input_el.addEventListener("keydown", e => {
    if (e.key === "Tab") {
        e.preventDefault();
        return;
    }

    if (e.key === "Enter") {
        e.preventDefault();
        return;
    }
});

input_el.addEventListener("keyup", e => {
    if (e.key === "Tab") {
        e.preventDefault();

        input_el.innerText += input_el.dataset.suggestion.split(",")[0];

        update_suggestion();
        focus_input();
        return;
    }

    if (e.key === "Enter") {
        e.preventDefault();
        execute(input.innerText);
        input_el.innerText = "";
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (input_el.innerText !== "" && history_index === 0)
            history.push(input_el.innerText);
        history_index--;
        input_el.innerText = get_history();
        focus_input();
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        history_index++;
        input_el.innerText = get_history();
        focus_input();
    }

    update_suggestion();
});

let task_create_regex = /task create \w* \d*( (once|inf|daily|weekly|monthly))*( \d,+)*/;
let task_id_points_regex = /task \d* points \d*/;
let task_id_name_regex = /task \d* name \w*/;
let task_id_delete_regex = /task \d* delete/;
let task_id_repeat_regex = /task \d* repeat (once|inf|daily|weekly|monthly)( \d\d\d\d-\d\d-\d\d)*/;
let task_id_start_regex = /task \d* start( \d\d\d\d-\d\d-\d\d)*/;
let task_id_copy_regex = /task \d* copy/;
let task_id_done_regex = /task \d* done( \d\d\d\d-\d\d-\d\d)*/;

let task_filter_todo_regex = /task filter todo/;
let task_filter_done_regex = /task filter done/;
let task_filter_name_regex = /task filter name \w*/;

let event_id_delete_regex = /event \d* delete/;
let event_id_points_regex = /event \d* points \d*/;

let database_clear_regex = /db clear/;

let command_list = [
    [task_create_regex, task_create],
    [task_id_name_regex, task_id_name],
    [task_id_points_regex, task_id_points],
    [task_id_delete_regex, task_id_delete],
    [task_id_repeat_regex, task_id_repeat],
    [task_id_start_regex, task_id_start],
    [task_id_copy_regex, task_id_copy],
    [task_id_done_regex, task_id_done],
    
    [task_filter_todo_regex, task_filter_todo],
    [task_filter_done_regex, task_filter_done],
    [task_filter_name_regex, task_filter_name],
    
    [event_id_delete_regex, event_id_delete],
    [event_id_points_regex, event_id_points],

    [database_clear_regex, database_clear],
];

function execute(command) {
    command = command.replaceAll(/\s/g, " ")

    try {
        for (const c of command_list) {
            if (command.match(c[0])) {
                c[1](command);
                input.dataset.suggestion = "";
                break;
            }
        }
    } catch (e) {
        input.dataset.suggestion = e;
    }

    history.push(command);
}

function database_clear() {
    database.clear();
}

function event_id_delete(input){}
function event_id_points(input){}

let history_index = 0;
let history = [""];

function get_history() {
    let index = history.length + history_index;

    if (index < 0) return history[0];
    if (index >= history.length) return "";

    return history[index];
}

focus_input()