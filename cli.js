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
    let input = input_el.innerText;

    let parts = input.split(" ");

    input_el.dataset.suggestion = "";

    let x = command;

    for (let part of parts) {
        if (typeof x === "function") {
            x = x.call(this, part);
        }
    }

    while (typeof x === "function") {
        x = x.call(this, "");
    }

    if (x) {
        for (let s of x) {
            input_el.dataset.suggestion += s + " ";
        }
    }
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
        
        if (!input.innerText.endsWith(" ")) input.innerText += " ";

        input.innerText += input_el.dataset.suggestion.split(",")[0];

        update_suggestion();
        focus_input();
        return;
    }

    if (e.key === "Enter") {
        e.preventDefault();
        execute(input.innerText);
        input.innerText = "";
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (input.innerText !== "" && history_index === 0)
            history.push(input.innerText);
        history_index--;
        input.innerText = get_history();
        focus_input();
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        history_index++;
        input.innerText = get_history();
        focus_input();
    }

    console.log(e.key)

    update_suggestion();
});

function execute(command) {
    let parts = command.split(" ");

    try {
        if (parts[0] === "task") {
            let id = parseInt(parts[1]);

            if (parts[2] === "done") {
                database.events.push({ id: 10, task: { id: id }, date: new Date() });
                instantiate(event_tm, event_el, database.events[database.events.length - 1]);
            }
        }
    } catch (e) {
        input.dataset.suggestion = e;
    }

    history.push(command);
}

let history_index = 0;
let history = [""];

function get_history() {
    let index = history.length + history_index;

    if (index < 0) return history[0];
    if (index >= history.length) return "";

    return history[index];
}

focus_input()