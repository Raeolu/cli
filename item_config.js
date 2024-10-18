let task_el = document.querySelector("#tasks");
let task_tm = document.querySelector("#task-template");

let event_el = document.querySelector("#events");
let event_tm = document.querySelector("#event-template");

let calendar_el = document.querySelector("#calendar");
let calendar_tm = document.querySelector("#calendar-template");

let items_config = {
    task: {
        template: task_tm,
        parent: task_el,
    },
    taskrepeat: {
        template: calendar_tm,
        parent: calendar_el,
    },
    event: {
        template: event_tm,
        parent: event_el,
    }
};