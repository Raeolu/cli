class Event {
    id;
    task_id;
    date;
    repeat_date;
    frozen_task;
    
    get task() {
        return database.tasks.find(x => x.id === this.frozen_task.id);
    }

    constructor(x) {
        this.id = x.id;
        this.task_id = x.task_id;
        this.date = x.date;
        this.repeat_date = x.repeat_date;
        this.frozen_task = x.frozen_task;
    }
}