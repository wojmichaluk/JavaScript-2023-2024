function sum(x,y) {
    return x+y;
}

function sum_strings(a) {
    var sum = 0;
    for (const val of a) {
        let num = parseInt(val, 10);
        if (!isNaN(num)) {
            sum += num;
        }
    }
    return sum;
}

function digits(s) {
    var digits_tab = [0, 0];
    for (const char of s) {
        let num = parseInt(char, 10);
        if (!isNaN(num)) {
            switch (num % 2) {
                case 0:
                    digits_tab[1] += num;
                    break;
                default:
                    digits_tab[0] += num;
                    break;
            }
        }
    }
    return digits_tab;
}

function letters(s) {
    var letters_tab = [0, 0];
    for (const char of s) {
        //check if `char` is a letter
        if (char.toUpperCase() == char.toLowerCase()) {
            continue;
        }

        //if it is, we can proceed
        if (char == char.toUpperCase()) {
            letters_tab[1] += 1;
        } else {
            letters_tab[0] += 1;
        }
    }
    return letters_tab;
}
