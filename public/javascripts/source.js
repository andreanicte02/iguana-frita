


const consoleTextArea = $("#consoleTextArea");

const myConsole = {

    log(text) {
        consoleTextArea.append(text);
    }
    ,

    clear() {
        consoleTextArea.text("");
    }

};

var god = [];

localStorage.god = "[]";

function addLine(line) {
    god.push(line);
}

function saveGod(){
    localStorage.god = JSON.stringify(god);
}