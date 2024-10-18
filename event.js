class Event {
    id;
    task_id;
    date;
    repeat_date;
    frozen_task;
    
    get task() {
        return database.get(Task.name, this.task_id)[0];
    }

    constructor(x) {
        this.id = x.id;

        if (typeof this.id === "string") {
            this.id = parseInt(this.id);
        }

        this.task_id = x.task_id;

        if (typeof this.task_id === "string") {
            this.task_id = parseInt(this.task_id);
        }

        this.date = x.date;

        if (typeof this.date === "string") {
            this.date = new Date(this.date);
        }

        this.repeat_date = x.repeat_date;
        
        if (typeof this.repeat_date === "string") {
            this.repeat_date = new Date(this.repeat_date);
        }

        this.frozen_task = x.frozen_task;
    }
}