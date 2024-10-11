class X extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let value;
        let expression = this.innerHTML;

        try {
            value = eval(expression);
        } catch (e) {
            console.log(e);
        }

        this.innerHTML = value ?? "";

        let refresh = 0;

        if (this.dataset.refresh) {
            setInterval(() => {
                if (window.database.refresh[this.dataset.refresh] > refresh) {
                    refresh = window.database.refresh[this.dataset.refresh];

                    try {
                        value = eval(expression);
                    } catch (e) {
                        console.log(e);
                    }

                    this.innerHTML = value ?? "";
                }
            }, 1000);
        }
    }
}

window.customElements.define("x-x", X);