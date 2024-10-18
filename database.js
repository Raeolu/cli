class Database {
    static TASK = "task";
    static EVENT = "event";

    _database = {
        task: [],
        event: [],
    }

    #event_listeners = {
        task: [],
        event: [],
    };

    constructor(x) {
        this._database = x?._database ?? this._database;

        console.log(this._database, this._database.task)

        for (let i = 0; i < this._database.task.length; i++) {
            this._database.task[i] = new Task(this._database.task[i]);
        }

        for (let i = 0; i < this._database.event.length; i++) {
            this._database.event[i] = new Event(this._database.event[i]);
        }
    }

    clear() {
        this._database = {
            task: [],
            event: [],
        };

        this.#event_listeners = {
            task: [],
            event: [],
        };

        this.#event(Database.TASK, null, "update");
        this.#event(Database.EVENT, null, "update");
    }

    id(type) {
        type = type.toLowerCase();

        if (this._database[type] === undefined)
            throw new Error(`Type not in database ${type}`);

        let max = 0;

        for (const item of this._database[type]) {
            if (item.id > max) max = item.id;
        }

        return max + 1;
    }

    get(type, id) {
        type = type.toLowerCase();

        if (this._database[type] === undefined)
            throw new Error(`Type not in database ${type}`);

        if (id === undefined)
            return this._database[type];

        let found = this._database[type].filter(x => x.id === id);

        if (found.length > 1)
            throw new Error(`Found ${found.length} items with id ${id}`);

        return found;
    }

    add(item) {
        let type = item?.constructor?.name?.toLowerCase();

        if (this._database[type] === undefined)
            throw new Error(`Type not in database ${type}`);

        this._database[type].push(item);
        this.#event(type, item, "add");
    }

    remove(type, id) {
        type = type.toLowerCase();

        if (this._database[type] === undefined)
            throw new Error(`Type not in database ${type}`);

        if (id === undefined)
            return this._database[type];

        let index = this._database[type].findIndex(x => x.id === id);

        if (index === -1)
            throw new Error(`Index not found ${type} ${id}`);

        let item = this._database[type].splice(index, 1);

        this.#event(type, item, "remove");
    }

    update(item) {
        let type = item?.constructor?.name?.toLowerCase();

        if (this.#event_listeners[type] === undefined)
            throw new Error(`Type not in database ${type}`);

        this.#event(type, item, "update");
    }

    listen(type, listener) {
        type = type.toLowerCase();

        if (this.#event_listeners[type] === undefined)
            throw new Error(`Type not in listeners ${type}`);

        if (typeof listener !== "function")
            throw new Error(`Listener is not a function: ${typeof listener}`);

        this.#event_listeners[type].push(listener);
    }

    #event(type, item, action) {
        type = type.toLowerCase();

        if (this.#event_listeners[type] === undefined)
            throw new Error(`Type not in listeners ${type}`);

        for (const listener of this.#event_listeners[type]) {
            listener({ action, item });
        }

        window.localStorage.setItem("database", JSON.stringify(this));
    }
}