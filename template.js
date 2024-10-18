function create_template(template, row) {
    let created_template = template.cloneNode(true);

    let original_HTML = created_template.innerHTML;

    let created_HTML = "";
    let expression = "";
    let inside = false;
    let indent = 0;

    for (let i = 0; i < original_HTML.length; i++) {
        let c = original_HTML[i];

        if (inside) {
            if (c === "{") indent++;

            if (c === "}" && indent === 0) {
                inside = false;

                if (row[expression] !== undefined) {
                    created_HTML += row[expression];
                    continue;
                }

                try {
                    created_HTML += eval(expression);
                } catch (e) {
                    console.log(e, expression)
                }

                continue;
            }

            if (c === "}") indent--;

            expression += c;

            continue;
        }

        if (c === "{") {
            inside = true;
            expression = "";
            continue;
        }

        created_HTML += c;
    }

    created_template.innerHTML = created_HTML;

    return created_template.content;
}

function find_item_element(item) {
    let type = item?.constructor?.name?.toLowerCase();

    if (!type)
        throw new Error(`Cannot find item of type ${type}`);

    let element = document.querySelector(`[data-${type}-id='${item.id}']`);

    if (!element)
        throw new Error(`Cannot find item ${type} ${id}`);

    return element;
}

function update_item(update) {
    let type = update.item?.constructor?.name?.toLowerCase();

    let item_config = items_config[type];

    if (!item_config)
        throw new Error(`No item config found for ${type}`);

    if (update.action === "add") {
        let created_template = create_template(item_config.template, update.item);

        item_config.parent.appendChild(created_template);
    } else if (update.action === "update") {
        let existing_template = find_item_element(update.item);

        if (!existing_template)
            throw new Error(`Update item element does not exist ${type} ${update.item.id}`);

        let created_template = create_template(item_config.template, update.item);

        existing_template.replaceWith(created_template);
    } else if (update.action === "remove") {
        let existing_template = find_item_element(update.item);

        existing_template.remove();
    }
}

function clear_items(type) {
    let items = document.querySelectorAll(`[data-${type}-id]`);

    for (const item of items) {
        item.remove();
    }
}