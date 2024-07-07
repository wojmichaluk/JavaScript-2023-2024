var slideIndex = 0;
var x = document.getElementsByClassName("mySlides");
var dots = document.getElementsByClassName("demo");
var vis = false;

showDivs(slideIndex);

{
    let input = document.getElementById("input");
    let output = document.getElementById("output");
    input.style.height = `${output.offsetHeight}px`;
}

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function currentDiv(n) {
    showDivs(slideIndex = n);
}

function showDivs(n) {
    var i;
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" w3-white", "");
    }
    x[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " w3-white";
}

carousel();

function carousel() {
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" w3-white", "");
    }
    slideIndex++;
    if (slideIndex > x.length) {slideIndex = 1}    
    x[slideIndex-1].style.display = "block"; 
    dots[slideIndex-1].className += " w3-white"; 
    setTimeout(carousel, 10000); // Change image every 10 seconds
}

function w3_change_state() {
    if (vis == false) {
        document.getElementById("myNavbar").style.display = "block";
        vis = true;
    } else {
        document.getElementById("myNavbar").style.display = "none";
        vis = false;
    }
}

function myFunction(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
    }
}

{
    "use strict";                                       // Nie wyłączaj trybu ścisłego    
    let canvas = document.getElementById('canvas');     // Tutaj jest użyty standard W3C DOM — będzie on tematem następnych ćwiczeń
    let ctx = canvas.getContext('2d');                  // Utworzenie obiektu 'CanvasRenderingContext2D'       

    //ustawienia do rysowania loga
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "blue");
    grad.addColorStop(0.4, "dodgerblue");
    grad.addColorStop(1, "springgreen");
    ctx.lineWidth = 5;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Za pomocą kształtów stworzę litery U,S,O,S
    //Tworzenie litery U
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.quadraticCurveTo(40, 240, 60, 20);
    ctx.stroke();

    //Tworzenie litery S
    ctx.beginPath();
    ctx.arc(100, 100, 30, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(130, 100);
    ctx.lineTo(70, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(100, 50, 30, Math.PI, 2*Math.PI);
    ctx.stroke();

    //Tworzenie litery O
    ctx.beginPath();
    ctx.ellipse(175, 75, 30, 55, 0.15, 0, 2*Math.PI);
    ctx.stroke();

    //Tworzenie litery S
    ctx.beginPath();
    ctx.arc(250, 100, 30, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(280, 100);
    ctx.lineTo(220, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(250, 50, 30, Math.PI, 2*Math.PI);
    ctx.stroke();
}

var request = indexedDB.open("UsosDatabase", 1);
let db;

request.onsuccess = function(event) {
    db = event.target.result;
    console.group("Połączenie z bazą danych ustalone");
    let style = "padding: 8px; margin: 5px; font-size: 16px; background-color: lightgreen";
    console.log("%cPrawidłowo otwarto bazę danych 😎", style);
    console.groupEnd();
}

request.onerror = function(event) {
    console.group("Problem z bazą danych");
    console.error("Nie udało się otworzyć bazy danych");
    console.groupEnd();
}

var canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

window.addEventListener("resize", function(event) {
    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

function parseCommand(value) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var command = String(value);
    var command_elements = command.split(' ');
    const commands = ["dodaj", "modyfikuj", "usuń", "wyświetl"];

    if (commands.indexOf(command_elements[0]) == -1) {
        console.group("Niepoprawna komenda")
        console.log("Wpisano komendę: " + command_elements[0]);
        console.error("Dostępne komendy: " + commands);
        console.groupEnd();
        return;
    }

    switch(command_elements[0]) {
        case "dodaj":
            handle_adding_grade(command_elements);
            break;
        case "modyfikuj":
            handle_modifying_grade(command_elements);
            break;
        case "usuń":
            handle_deleting_grade(command_elements);
            break;
        case "wyświetl":
            handle_displaying(command_elements);
            break;
        default: //shouldn't happen
            break;
    }
}

function handle_adding_grade(elements) {
    //syntax: command_name | student_id | course_id | grade
    if (elements.length !== 4) {
        console.group("Niepoprawna składnia komendy")
        console.log("Komenda ma " + elements.length + " elementy");
        console.warn("Komenda `dodaj` powinna mieć 4 elementy:\n" +
            "nazwę komendy, id studenta, id przedmiotu oraz dodawaną ocenę");
        console.groupEnd();
        return;
    }

    const possibleGrades = ['2.0', '3.0', '3.5', '4.0', '4.5', '5.0'];

    if (possibleGrades.indexOf(elements[3]) == -1) {
        console.group("Niepoprawna ocena")
        console.log("Podano ocenę: " + elements[3]);
        console.warn("\nPoprawne oceny: " + possibleGrades + "\n");
        console.groupEnd();
        return;
    } 

    let transaction = db.transaction("dict", "readwrite");
    let objectStore = transaction.objectStore("dict"); 
    let getRequest = objectStore.get([+elements[1], +elements[2]]);

    getRequest.onsuccess = function(event) {
        let result = event.target.result;

        if (result === undefined) {
            console.group("Błąd dodania oceny");
            console.error("Nie znaleziono studenta o ID: " + elements[1] +
                ",\nktóry by był zapisany na przedmiot o ID: " + elements[2]);
            console.groupEnd();
        } else {
            result.grades.push(elements[3]);

            let updateRequest = objectStore.put(result);

            updateRequest.onsuccess = function(event) {
                let message = [`Dodano ocenę: ${elements[3]}`,
                    `ID studenta: ${elements[1]}`,
                    `ID przedmiotu: ${elements[2]}`];

                drawSuccess(message);
            }

            updateRequest.onerror = function(event) { //shouldn't happen
                console.group("Błąd dodania oceny");
                console.error("Nie udało się dodać oceny: " + elements[3] +
                    " studentowi " + elements[1] + " z przedmiotu " + elements[2]);
                console.groupEnd();
            }
        }
    }

    getRequest.onerror = function(event) { //shouldn't happen
        console.group("Błąd dodania oceny");
        console.error("Nie udało się dodać oceny: " + elements[3] +
            " studentowi " + elements[1] + " z przedmiotu " + elements[2]);
        console.groupEnd();
    }
}

function handle_modifying_grade(elements) {
    //syntax: command_name | student_id | course_id | new_grade | grade_index
    if (elements.length !== 5) {
        console.group("Niepoprawna składnia komendy")
        console.log("Komenda ma " + elements.length + " elementy");
        console.warn("Komenda `modyfikuj` powinna mieć 5 elementów:\n" +
            "nazwę komendy, id studenta, id przedmiotu, nowa ocenę\n" +
            " oraz indeks modyfikowanej oceny, która ma być zastąpiona");
        console.groupEnd();
        return;
    }

    const possibleGrades = ['2.0', '3.0', '3.5', '4.0', '4.5', '5.0'];

    if (possibleGrades.indexOf(elements[3]) == -1) {
        console.group("Niepoprawna ocena")
        console.log("Podano ocenę: " + elements[3]);
        console.warn("\nPoprawne oceny: " + possibleGrades + "\n");
        console.groupEnd();
        return;
    } 

    if (isNaN(Number(elements[4]))) {
        console.group("Niepoprawny indeks oceny")
        console.log("Niepoprawny indeks oceny, niebędący liczbą\n")
        console.warn("Podano indeks: " + elements[4]);
        console.groupEnd();
        return;
    }

    let transaction = db.transaction("dict", "readwrite");
    let objectStore = transaction.objectStore("dict"); 
    let getRequest = objectStore.get([+elements[1], +elements[2]]);

    getRequest.onsuccess = function(event) {
        let result = event.target.result;

        if (result === undefined) {
            console.group("Błąd modyfikacji oceny");
            console.error("Nie znaleziono studenta o ID: " + elements[1] +
                ",\nktóry by był zapisany na przedmiot o ID: " + elements[2]);
            console.groupEnd();
        } else if (result.grades.length <= +elements[4] || +elements[4] < 0) {
            console.group("Błąd modyfikacji oceny");
            console.error("Podano indeks oceny poza zakresem tablicy ocen" +
                `\nPodano indeks: ${elements[4]}, rozmiar tablicy: ${result.grades.length}`);
            console.groupEnd();
        } else {
            result.grades[+elements[4]] = elements[3];

            let updateRequest = objectStore.put(result);

            updateRequest.onsuccess = function(event) {
                let message = [`Zmieniono ocenę na: ${elements[3]}`,
                    `ID studenta: ${elements[1]}`,
                    `ID przedmiotu: ${elements[2]}`];

                drawSuccess(message);
            }

            updateRequest.onerror = function(event) { //shouldn't happen
                console.group("Błąd modyfikacji oceny");
                console.error("Nie udało się zmodyfikować oceny: " + elements[3] +
                    " studentowi " + elements[1] + " z przedmiotu " + elements[2]);
                console.groupEnd();
            }
        }
    }

    getRequest.onerror = function(event) { //shouldn't happen
        console.group("Błąd modyfikacji oceny");
        console.error("Nie udało się zmodyfikować oceny: " + elements[3] +
            " studentowi " + elements[1] + " z przedmiotu " + elements[2]);
        console.groupEnd();
    }
}

function handle_deleting_grade(elements) {
    //syntax: command_name | student_id | course_id | grade_index
    if (elements.length !== 4) {
        console.group("Niepoprawna składnia komendy")
        console.log("Komenda ma " + elements.length + " elementy");
        console.warn("Komenda `usuń` powinna mieć 4 elementy:\n" +
            "nazwę komendy, id studenta, id przedmiotu oraz indeks usuwanej oceny");
        console.groupEnd();
        return;
    }

    if (isNaN(Number(elements[3]))) {
        console.group("Niepoprawny indeks oceny")
        console.log("Niepoprawny indeks oceny, niebędący liczbą\n")
        console.warn("Podano indeks: " + elements[3]);
        console.groupEnd();
        return;
    }

    let transaction = db.transaction("dict", "readwrite");
    let objectStore = transaction.objectStore("dict"); 
    let getRequest = objectStore.get([+elements[1], +elements[2]]);

    getRequest.onsuccess = function(event) {
        let result = event.target.result;

        if (result === undefined) {
            console.group("Błąd usuwania oceny");
            console.error("Nie znaleziono studenta o ID: " + elements[1] +
                ",\nktóry by był zapisany na przedmiot o ID: " + elements[2]);
            console.groupEnd();
        } else if (result.grades.length <= +elements[3] || +elements[3] < 0) {
            console.group("Błąd usuwania oceny");
            console.error("Podano indeks oceny poza zakresem tablicy ocen" +
                `\nPodano indeks: ${elements[3]}, rozmiar tablicy: ${result.grades.length}`);
            console.groupEnd();
        } else {
            let deletedGrade = result.grades[+elements[3]];
            result.grades.splice(+elements[3], 1);

            let updateRequest = objectStore.put(result);

            updateRequest.onsuccess = function(event) {
                let message = [`Usunięto ocenę: ${deletedGrade}`,
                    `ID studenta: ${elements[1]}`,
                    `ID przedmiotu: ${elements[2]}`];

                drawSuccess(message);
            }

            updateRequest.onerror = function(event) { //shouldn't happen
                console.group("Błąd usuwania oceny");
                console.error("Nie udało się usunąć oceny: " + deletedGrade +
                    " studentowi " + elements[1] + " z przedmiotu " + elements[2]);
                console.groupEnd();
            }
        }
    }

    getRequest.onerror = function(event) { //shouldn't happen
        console.group("Błąd usuwania oceny");
        console.error("Nie udało się usunąć oceny " +
            " studentowi " + elements[1] + " z przedmiotu " + elements[2]);
        console.groupEnd();
    }
}

function handle_displaying(elements) {
    //syntax: command_name | "student" / "przedmiot" | student_id / course_id
    if (elements.length !== 3 || !(elements[1] === "student" || elements[1] === "przedmiot")) {
        console.group("Niepoprawna składnia komendy")
        console.log("Komenda ma " + elements.length + " elementy");
        console.warn("Komenda `wyświetl` powinna mieć 3 elementy:\n" +
            "- nazwę komendy, 'student' oraz id studenta\n" +
            "(w przypadku wyświetlenia wykazu ocen dla studenta)\n" +
            "- nazwę komendy, 'przedmiot' oraz id przedmiotu\n" +
            "(w przypadku wyświetlenia wykazu ocen dla przedmiotu)");
        console.groupEnd();
        return;
    }

    if (elements[1] === "student") {
        let studentsTransaction = db.transaction("students", "readonly");
        let studentsStore = studentsTransaction.objectStore("students"); 
        let checkStudent = studentsStore.get(+elements[2]);

        checkStudent.onsuccess = function(event) {
            let result = event.target.result;

            if (result === undefined) {
                console.group("Błąd wyświetlania ocen");
                console.error("Nie znaleziono studenta o ID: " + elements[2]);
                console.groupEnd();
            } else {
                let subjects = new Set();
                let subjectsNames = new Set();
                let subjectGrades = [];
                let gradesAverages = [];

                let dictTransaction = db.transaction("dict", "readonly");
                let dictStore = dictTransaction.objectStore("dict");
                let cursorRequest = dictStore.openCursor();

                cursorRequest.onsuccess = function(event) {
                    let cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value.student_id === +elements[2]) {
                            subjects.add(cursor.value.course_id);
                            subjectGrades.push(cursor.value.grades);
                            gradesAverages.push(calculateAverage(cursor.value.grades).toFixed(2));
                        }
                        
                        cursor.advance(1);
                    }

                    //to include last record (it happens to be omitted)
                    let allRecords = dictStore.getAll();
                    allRecords.onsuccess = function() {
                        let lastRecord = allRecords.result[allRecords.result.length - 1];
                        if (lastRecord.student_id === +elements[2] && !subjects.has(lastRecord.student_id)) {
                            subjects.add(lastRecord.course_id);
                            subjectGrades.push(lastRecord.grades);
                            gradesAverages.push(calculateAverage(lastRecord.grades).toFixed(2));
                        }
                    };
                    
                    let coursesTransaction = db.transaction("courses", "readonly");
                    let coursesStore = coursesTransaction.objectStore("courses");

                    for (const subject of subjects) {
                        let checkCourse = coursesStore.get(subject);
                        checkCourse.onsuccess = function(event) {
                            result = event.target.result;
                            subjectsNames.add(result.name);
                        }
                    }

                    let message = [`Wykaz ocen dla studenta o ID: ${elements[2]}`];

                    for (const name of subjectsNames) {
                        message.push(`${name}: `);
                    }

                    for (let i = 0; i < subjectsNames.size; i++) {
                        message[i + 1] += `${subjectGrades[i]} | średnia: ${gradesAverages[i]}`;
                    }

                    drawSuccess(message);
                }
            }
        }

        checkStudent.onerror = function(event) { //shouldn't happen
            console.group("Błąd wyświetlania ocen");
            console.error("Nie znaleziono studenta o ID: " + elements[2]);
            console.groupEnd();
        }
    } else {
        let coursesTransaction = db.transaction("courses", "readonly");
        let coursesStore = coursesTransaction.objectStore("courses"); 
        let checkCourse = coursesStore.get(+elements[2]);

        checkCourse.onsuccess = function(event) {
            let result = event.target.result;

            if (result === undefined) {
                console.group("Błąd wyświetlania ocen");
                console.error("Nie znaleziono przedmiotu o ID: " + elements[2]);
                console.groupEnd();
            } else {
                let subjectGrades = [];
                let name = result.name;

                let dictTransaction = db.transaction("dict", "readonly");
                let dictStore = dictTransaction.objectStore("dict");
                let cursorRequest = dictStore.openCursor();

                cursorRequest.onsuccess = function(event) {
                    let cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value.course_id === +elements[2]) {
                            subjectGrades.push(cursor.value.grades);
                        }
                        
                        cursor.continue();
                    }

                    let message = [`Wykaz ocen dla przedmiotu ${name}:`];

                    for (const grades of subjectGrades) {
                        message.push(`${grades}`);
                    }

                    drawSuccess(message);
                }
            }
        }

        checkCourse.onerror = function(event) { //shouldn't happen
            console.group("Błąd wyświetlania ocen");
            console.error("Nie znaleziono przedmiotu o ID: " + elements[2]);
            console.groupEnd();
        }
    }
}

function drawSuccess(message) {
    ctx.arc(50, 50, 45, 0, 2 * Math.PI);
    ctx.fillStyle = "lightgreen";
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(25, 55);
    ctx.lineTo(50, 75);
    ctx.moveTo(50, 75);
    ctx.lineTo(75, 30);

    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = '20px Arial'; 

    for (let i = 0; i < message.length; i++) {
        ctx.fillText(message[i], 5, 120 + 20 * i);
    }
}

function calculateAverage(grades) {
    if (grades.length === 0) {
        return 0.0;
    }

    let total = 0.0;
    for (let grade of grades) {
        total += +grade;
    }

    return total / grades.length;
}
