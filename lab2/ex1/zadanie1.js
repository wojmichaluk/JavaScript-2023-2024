function funkcja_zwrotna() {

    let text = document.forms[0].elements['pole_tekstowe'];
    let num = document.forms[0].elements['pole_liczbowe'];

    console.log(text + ":" + typeof text);
    console.log(num + ":" + typeof num);
}

function fourTimes() {
    for (let i = 0; i < 4; i++) {
        let val = window.prompt("Podaj jakąś wartość: ");
        console.log(val + ":" + typeof val);
    }
}

function parseValue (text, num) {
    let text_num = Number(text);
    if (isNaN(text_num)) {
        return text + num;
    } else {
        return +text_num + +num;
    }
}
