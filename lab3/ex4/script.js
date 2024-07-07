var slideIndex = 0;
var x = document.getElementsByClassName("mySlides");
var dots = document.getElementsByClassName("demo");
var vis = false;

showDivs(slideIndex);

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

    prepareStudentsTab();
}

request.onerror = function(event) {
    console.group("Problem z bazą danych");
    console.error("Nie udało się otworzyć bazy danych");
    console.groupEnd();
}

function parseCommand(value) {
    var command = String(value);
    var command_elements = command.split(' ');
    const commands = ["dodaj", "modyfikuj", "usuń", "wyświetl"];

    if (commands.indexOf(command_elements[0]) == -1) {
        window.alert("Niepoprawna komenda! Wpisano komendę: " + command_elements[0] +
            "\nDostępne komendy: " + commands);

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
        window.alert("Niepoprawna składnia komendy! Komenda ma " +
            elements.length + " elementy.\nKomenda `dodaj` powinna mieć 4 elementy:\n" +
            "nazwę komendy, id studenta, id przedmiotu oraz dodawaną ocenę");

        return;
    }

    const possibleGrades = ['2.0', '3.0', '3.5', '4.0', '4.5', '5.0'];

    if (possibleGrades.indexOf(elements[3]) == -1) {
        window.alert("Niepoprawna ocena! Podano ocenę " + elements[3] +
            "\nPoprawne oceny: " + possibleGrades);

        return;
    } 

    let transaction = db.transaction("dict", "readwrite");
    let objectStore = transaction.objectStore("dict"); 
    let getRequest = objectStore.get([+elements[1], +elements[2]]);

    getRequest.onsuccess = function(event) {
        let result = event.target.result;

        if (result === undefined) {
            window.alert("Błąd dodania oceny! Nie znaleziono studenta o ID: " +
                elements[1] + ",\nktóry by był zapisany na przedmiot o ID: " +
                elements[2]);

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
                window.alert("Błąd dodania oceny! Nie udało się dodać oceny" +
                    elements[3] + "\nstudentowi " + elements[1] + " z przedmiotu " +
                    elements[2]);

            }
        }
    }

    getRequest.onerror = function(event) { //shouldn't happen
        window.alert("Błąd dodania oceny! Nie udało się dodać oceny: " +
            elements[3] + "\nstudentowi " + elements[1] + " z przedmiotu " +
            elements[2]);

    }
}

function handle_modifying_grade(elements) {
    //syntax: command_name | student_id | course_id | new_grade | grade_index
    if (elements.length !== 5) {
        window.alert("Niepoprawna składnia komendy! Komenda ma " +
            elements.length + " elementy.\nKomenda `modyfikuj` powinna mieć 5 elementów:\n" +
            "nazwę komendy, id studenta, id przedmiotu, nową ocenę\n" +
            "oraz indeks modyfikowanej oceny, która ma być zastąpiona");

        return;
    }

    const possibleGrades = ['2.0', '3.0', '3.5', '4.0', '4.5', '5.0'];

    if (possibleGrades.indexOf(elements[3]) == -1) {
        window.alert("Niepoprawna ocena! Podano ocenę " + elements[3] +
            "\nPoprawne oceny: " + possibleGrades);

        return;
    } 

    if (isNaN(Number(elements[4]))) {
        window.alert("Niepoprawny indeks oceny! Nie jest on liczbą\n" +
            "Podano indeks: " + elements[4]);

        return;
    }

    let transaction = db.transaction("dict", "readwrite");
    let objectStore = transaction.objectStore("dict"); 
    let getRequest = objectStore.get([+elements[1], +elements[2]]);

    getRequest.onsuccess = function(event) {
        let result = event.target.result;

        if (result === undefined) {
            window.alert("Błąd modyfikacji oceny! Nie znaleziono studenta o ID: " +
                elements[1] + ",\nktóry by był zapisany na przedmiot o ID: " +
                elements[2]);

        } else if (result.grades.length <= +elements[4] || +elements[4] < 0) {
            window.alert("Błąd modyfikacji oceny! Podano indeks oceny poza zakresem\n" +
                "tablicy ocen. Podano indeks: " + elements[4] + ", rozmiar tablicy: " +
                result.grades.length);

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
                window.alert("Błąd modyfikacji oceny! Nie udało się zmodyfikować oceny" +
                    elements[3] + "\nstudentowi " + elements[1] + " z przedmiotu " +
                    elements[2]);

            }
        }
    }

    getRequest.onerror = function(event) { //shouldn't happen
        window.alert("Błąd modyfikacji oceny! Nie udało się zmodyfikować oceny" +
            elements[3] + "\nstudentowi " + elements[1] + " z przedmiotu " +
            elements[2]);

    }
}

function handle_deleting_grade(elements) {
    //syntax: command_name | student_id | course_id | grade_index
    if (elements.length !== 4) {
        window.alert("Niepoprawna składnia komendy! Komenda ma " +
            elements.length + " elementy.\nKomenda `usuń` powinna mieć 4 elementy:\n" +
            "nazwę komendy, id studenta, id przedmiotu oraz indeks usuwanej oceny");

        return;
    }

    if (isNaN(Number(elements[3]))) {
        window.alert("Niepoprawny indeks oceny! Nie jest on liczbą\n" +
            "Podano indeks: " + elements[3]);

        return;
    }

    let transaction = db.transaction("dict", "readwrite");
    let objectStore = transaction.objectStore("dict"); 
    let getRequest = objectStore.get([+elements[1], +elements[2]]);

    getRequest.onsuccess = function(event) {
        let result = event.target.result;

        if (result === undefined) {
            window.alert("Błąd usuwania oceny! Nie znaleziono studenta o ID: " +
                elements[1] + ",\nktóry by był zapisany na przedmiot o ID: " +
                elements[2]);

        } else if (result.grades.length <= +elements[3] || +elements[3] < 0) {
            window.alert("Błąd usuwania oceny! Podano indeks oceny poza zakresem\n" +
                "tablicy ocen. Podano indeks: " + elements[3] + ", rozmiar tablicy: " +
                result.grades.length);

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
                window.alert("Błąd usuwania oceny! Nie udało się usunąć oceny" +
                    deletedGrade + "\nstudentowi " + elements[1] + " z przedmiotu " +
                    elements[2]);

            }
        }
    }

    getRequest.onerror = function(event) { //shouldn't happen
        window.alert("Błąd usuwania oceny! Nie udało się usunąć oceny" +
            "\nstudentowi " + elements[1] + " z przedmiotu " + elements[2]);

    }
}

function handle_displaying(elements) {
    //syntax: command_name | "student" / "przedmiot" | student_id / course_id
    if (elements.length !== 3 || !(elements[1] === "student" || elements[1] === "przedmiot")) {
        window.alert("Niepoprawna składnia komendy! Komenda ma " +
            elements.length + " elementy.\nKomenda `wyświetl` powinna mieć 3 elementy:\n" +
            "- nazwę komendy, 'student' oraz id studenta\n" +
            "(w przypadku wyświetlenia wykazu ocen dla studenta)\n" +
            "- nazwę komendy, 'przedmiot' oraz id przedmiotu\n" +
            "(w przypadku wyświetlenia wykazu ocen dla przedmiotu)");

        return;
    }

    if (elements[1] === "student") {
        let studentsTransaction = db.transaction("students", "readonly");
        let studentsStore = studentsTransaction.objectStore("students"); 
        let checkStudent = studentsStore.get(+elements[2]);

        checkStudent.onsuccess = function(event) {
            let result = event.target.result;

            if (result === undefined) {
                window.alert("Błąd wyświetlania ocen! Nie znaleziono studenta " +
                    "o ID: " + elements[2]);

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
            window.alert("Błąd wyświetlania ocen! Nie znaleziono studenta " +
                "o ID: " + elements[2]);

        }
    } else {
        let coursesTransaction = db.transaction("courses", "readonly");
        let coursesStore = coursesTransaction.objectStore("courses"); 
        let checkCourse = coursesStore.get(+elements[2]);

        checkCourse.onsuccess = function(event) {
            let result = event.target.result;

            if (result === undefined) {
                window.alert("Błąd wyświetlania ocen! Nie znaleziono przedmiotu " +
                    "o ID: " + elements[2]);

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
            window.alert("Błąd wyświetlania ocen! Nie znaleziono przedmiotu " +
                "o ID: " + elements[2]);

        }
    }
}

function drawSuccess(message) {
    let resultDiv = document.getElementById("result_div");
    resultDiv.textContent = '';
    let paragraph = document.createElement('p');

    for (let i = 0; i < message.length; i++) {
        let textNode = document.createTextNode(message[i]);
        let brNode = document.createElement('br');

        paragraph.appendChild(textNode);
        paragraph.appendChild(brNode);
    }

    paragraph.style.fontSize = "2.1vw";
    resultDiv.appendChild(paragraph);
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

function prepareStudentsTab() {
    let studentsTransaction = db.transaction("students", "readonly");
    let studentsStore = studentsTransaction.objectStore("students");
    let allStudents = studentsStore.getAll();

    allStudents.onsuccess = function() {
        let result = allStudents.result;
        let menu = document.getElementById('students_tab');

        for (let i = 0; i < result.length; i++) {
            let fullName = result[i].name;
            let studentId = result[i].student_id;

            let newMenuDiv = document.createElement('div');
            let textNode = document.createTextNode(fullName);
            let surroundingDiv = document.createElement('div');

            newMenuDiv.setAttribute('id', `student_tab${studentId}`);
            newMenuDiv.classList.add("w3-bar-item", "w3-button", "tablink", "w3-blue-gray");
            newMenuDiv.style.border = 'solid black 2px';
            newMenuDiv.style.width = "98%";
            newMenuDiv.style.margin = '2px 1%';
            newMenuDiv.addEventListener("click", openStudentPage);

            surroundingDiv.classList.add("w3-col", "s6", "m4", "l2");

            newMenuDiv.appendChild(textNode);
            surroundingDiv.appendChild(newMenuDiv);
            menu.appendChild(surroundingDiv);
        }

        prepareStudentsInfo(result);
    }

    allStudents.onerror = function() { //shouldn't happen
        window.alert("Błąd wczytania studentów! Wczytanie studentów nie powiodło się!");
    }
}

function prepareStudentsInfo(students) {
    let dictTransaction = db.transaction("dict", "readonly");
    let dictStore = dictTransaction.objectStore("dict");
    let inputs = dictStore.getAll();

    inputs.onsuccess = function() {
        let container = document.getElementById('students_info');
        container.classList.add("w3-cell-row");
        let result = inputs.result;

        for (let i = 0; i < students.length; i++) {
            let fullName = students[i].name;
            let studentId = students[i].student_id;

            let newInfoPageDiv = document.createElement('div');
            let imageNode = document.createElement('img');
            imageNode.src = 'images/avatar.png';
            imageNode.alt = `student ${studentId} avatar, displaying his photo`;
            imageNode.classList.add("w3-col", "s6", "m4", "l3");

            let name = document.createElement('p');
            let textNode = document.createTextNode(fullName);

            name.appendChild(textNode);
            name.style.fontSize = '3.5vw';
            name.classList.add("w3-col", "s6", "m8", "l9");

            let descStudent = document.createElement('p');
            let studentText = document.createTextNode("Panel studenta");
            
            descStudent.appendChild(studentText);
            descStudent.style.fontSize = '2.1vw';
            descStudent.classList.add("w3-col", "s2", "m4", "l5");

            let descGeneral = document.createElement('p');
            let generalText = document.createTextNode("Panel ogólny");
            
            descGeneral.appendChild(generalText);
            descGeneral.style.fontSize = '2.1vw';
            descGeneral.classList.add("w3-col", "s4");

            newInfoPageDiv.setAttribute('id', `student_info${studentId}`);
            newInfoPageDiv.classList.add("w3-cell-row", "w3-center", "infopage");
            newInfoPageDiv.style.display = 'none';

            if (isEnrolled(studentId, result)) {
                newInfoPageDiv.classList.add("w3-white");
            } else {
                newInfoPageDiv.classList.add("w3-gray");
            }

            newInfoPageDiv.appendChild(imageNode);
            newInfoPageDiv.appendChild(name);
            newInfoPageDiv.appendChild(descStudent);
            newInfoPageDiv.appendChild(descGeneral);
            
            container.appendChild(newInfoPageDiv);
        }

        setupControlPanel();
    }

    inputs.onerror = function() {
        window.alert("Błąd wczytania słownika! Wczytanie słownika nie powiodło się!");
    }
}

function isEnrolled(id, result) {
    for (let i = 0; i < result.length; i++) {
        if (id == result[i].student_id) {
            return true;
        }
    }

    return false;
}

function openStudentPage(studentEvent) {
    let suffixId = studentEvent.target.id.substring(11); //id after 'student_tab'
    let fullInfoPageId = 'student_info' + suffixId;

    closeAllInfoPages();
    resetPanel();
    let pageToDisplay = document.getElementById(fullInfoPageId);
    pageToDisplay.style.display = '';

    document.getElementById('add_grade').style.display = '';
    document.getElementById('modify_grade').style.display = '';
    document.getElementById('delete_grade').style.display = '';
    document.getElementById('display_student').style.display = '';
    document.getElementById('display_courses').style.display = '';
    document.getElementById('close_all').style.display = '';
}

function setupControlPanel() {
    let container = document.getElementById('students_info');

    let addGrade = createHandlingForm("Dodaj ocenę", "add_area", "add_form", "add_grade", "Podaj id przedmiotu i ocenę, oddzielone spacjami:");
    let modifyGrade = createHandlingForm("Zmień ocenę", "modify_area", "modify_form", "modify_grade", "Podaj id przedmiotu, nową ocenę i indeks zmienianej oceny, oddzielone spacjami:");
    let deleteGrade = createHandlingForm("Usuń ocenę", "delete_area", "delete_form", "delete_grade", "Podaj id przedmiotu i indeks usuwanej oceny, oddzielone spacjami:");
    let displayStudent = createHandlingDiv("Wykaz ocen", "display_student");
    let displayCourses = createHandlingForm("Wykaz przedmiotów", "displayc_area", "displayc_form", "display_courses", "Podaj id przedmiotu:");
    let closeDiv = createClosingDiv();

    setupFormEventListeners();

    displayStudent.addEventListener("click", function(event) {
        parseCommand("wyświetl student " + getActiveStudent());
    })

    displayStudent.style.borderRight = 'dashed black 4px';
    displayCourses.style.borderLeft = '';

    container.appendChild(addGrade);
    container.appendChild(modifyGrade);
    container.appendChild(deleteGrade);
    container.appendChild(displayStudent);
    container.appendChild(displayCourses);
    container.appendChild(closeDiv);
}

function createHandlingForm(text, areaId, formId, divId, labelText) {
    let div = document.createElement('div');
    let formContainer = document.getElementById('forms_div');
    div.textContent = text;

    let form = document.createElement('form');
    let label = document.createElement('label');
    label.htmlFor = areaId;
    label.textContent = labelText + ' ';
    let area = document.createElement('textarea');
    area.rows = 1;
    area.style.resize = 'none';
    area.setAttribute('id', areaId);

    form.setAttribute('id', formId);
    form.appendChild(label);
    form.appendChild(area);
    form.classList.add("grade_forms")
    form.style.display = 'none';

    formContainer.appendChild(form);
    div.setAttribute('id', divId);
    div.style.display = 'none';
    div.style.marginTop = "16px"; 
    div.classList.add("w3-col", "s2", "w3-amber", "w3-padding", "student_div");
    div.style.border = 'solid black 1px';

    div.addEventListener("click", function(event) {
        showGivenForm(divId, formId);
    });

    return div;
}

function createHandlingDiv(text, divId) {
    let div = document.createElement('div');

    div.textContent = text;
    div.setAttribute('id', divId);
    div.style.display = 'none';
    div.style.marginTop = "16px"; 
    div.classList.add("w3-col", "s2", "w3-amber", "w3-padding", "student_div");
    div.style.border = 'solid black 1px';

    div.addEventListener("click", function(event) {
        resetPanel();
        document.getElementById(divId).classList.replace("w3-amber", "w3-orange");
    });

    return div;
}

function createClosingDiv() {
    let closeDiv = document.createElement('div');

    closeDiv.textContent = "Zamknij zakładkę"
    closeDiv.setAttribute('id', "close_all");
    closeDiv.style.marginTop = "16px";
    closeDiv.style.display = 'none';
    closeDiv.classList.add("w3-col", "s2", "w3-red", "w3-padding", "student_div");
    closeDiv.style.border = 'solid black 1px';
    closeDiv.addEventListener("click", closeAllStudentDivs);

    return closeDiv;
}

function setupFormEventListeners() {
    document.getElementById("add_form").addEventListener("change", function(event) {
        parseCommand("dodaj " + getActiveStudent() + " " + event.target.value);
    });

    document.getElementById("modify_form").addEventListener("change", function(event) {
        parseCommand("modyfikuj " + getActiveStudent() + " " + event.target.value);
    });

    document.getElementById("delete_form").addEventListener("change", function(event) {
        parseCommand("usuń " + getActiveStudent() + " " + event.target.value);
    });

    document.getElementById("displayc_form").addEventListener("change", function(event) {
        parseCommand("wyświetl przedmiot " + event.target.value);
    });
}

function getActiveStudent() {
    let allInfoPages = document.getElementsByClassName("infopage");
    for (i = 0; i < allInfoPages.length; i++) {
        if (allInfoPages[i].style.display !== "none") {
            return allInfoPages[i].id.substring(12);
        }
    }

    return '';
}

function closeAllStudentDivs() {
    hideAllDivs();
    closeAllInfoPages();
    resetPanel();
}

function showGivenForm(divId, formId) {
    resetPanel();
    document.getElementById(formId).style.display = '';
    document.getElementById(formId).childNodes[1].value = '';
    document.getElementById(divId).classList.replace("w3-amber", "w3-orange");
}

function closeAllInfoPages() {
    let allInfoPages = document.getElementsByClassName("infopage");
    for (i = 0; i < allInfoPages.length; i++) {
        allInfoPages[i].style.display = "none";
    }
}

function resetPanel() {
    let forms = document.getElementsByClassName("grade_forms");
    let studentDivs = document.getElementsByClassName("student_div");
    let resultDiv = document.getElementById("result_div");
    
    resultDiv.textContent = '';

    for (let form of forms) {
        form.style.display = 'none';
    }

    for (let div of studentDivs) {
        div.classList.replace("w3-orange", "w3-amber");
    }
}

function hideAllDivs() {
    let studentDivs = document.getElementsByClassName("student_div");
    for (let div of studentDivs) {
        div.style.display = 'none';
    }
}
