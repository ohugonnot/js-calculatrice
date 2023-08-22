class Calculette {
    constructor(num) {
        this.display = document.getElementById("display");
        this.display.value = num;
    }

    reset() {
        this.display.value = "";
    }
}

let calculatrice = new Calculette(100);