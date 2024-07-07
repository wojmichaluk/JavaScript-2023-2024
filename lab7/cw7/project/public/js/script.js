var slideIndex = 1;
var vis = false;
var slides = document.getElementsByClassName("slide");
var tags = document.getElementsByClassName("w3-tag");

function changeNavBarDisplay() {
    if (vis == false) {
        document.getElementById("myNavBar").style.display = "block";
        vis = true;
    } else {
        document.getElementById("myNavBar").style.display = "none";
        vis = false;
    }
}

function changeStudiesDisplay(id) {
    var studies = document.getElementById(id);

    if (studies.className.indexOf("w3-show") == -1) {
        studies.className += " w3-show";
    } else {
        studies.className = studies.className.replace(" w3-show", "");
    }
}

function changeSlide(n) {
    showSlide((slideIndex += n));
}

function setCurrentSlide(n) {
    showSlide((slideIndex = n));
}

function showSlide(n) {
    var i;

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < tags.length; i++) {
        tags[i].className = tags[i].className.replace(" w3-white", "");
    }

    slides[slideIndex - 1].style.display = "block";
    tags[slideIndex - 1].className += " w3-white";
}

function carousel() {
    var i;

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < tags.length; i++) {
        tags[i].className = tags[i].className.replace(" w3-white", "");
    }

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    slides[slideIndex - 1].style.display = "block";
    tags[slideIndex - 1].className += " w3-white";
    setTimeout(carousel, 10000); // Change image every 10 seconds
}

function configureNavBar() {
    let studiesButton = document.getElementById("studies_button");
    studiesButton.addEventListener("click", function () {
        changeStudiesDisplay("studies");
    });

    let hideButton = document.getElementById("hide_button");
    hideButton.addEventListener("click", function () {
        changeNavBarDisplay();
    });
}

function configureSlider() {
    let minusSlide = document.getElementById("minus_slide");
    minusSlide.addEventListener("click", function () {
        changeSlide(-1);
    });

    let plusSlide = document.getElementById("plus_slide");
    plusSlide.addEventListener("click", function () {
        changeSlide(1);
    });

    for (let tag of tags) {
        let slideNum = Number(tag.getAttribute("id")[3]);
        tag.addEventListener("click", () => {
        setCurrentSlide(slideNum);
        });
    }
}

function getArgs(data) {
    let args;
    let student = data.student;
    let subject = data.subject;
    let grade = data.grade;
    let index = data.index;
    let op = data.op;
    let res_type = data.type;

    if (op === "ADD") {
        args = { student: student, subject: subject, grade: grade, type: res_type };
    } else if (op === "MODIFY") {
        args = { student: student, subject: subject, grade: grade, index: index, type: res_type };
    } else if (op === "DELETE") {
        args = { student: student, subject: subject, index: index, type: res_type };
    }

    return args;
}

function requestAJAX(http_method, response_type, args) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function (_evt) {
        if (xhr.status === 200) {
        let response = xhr.response;
        switch (response_type) {
            case "json":
            response = JSON.stringify(xhr.response, null, 4);
            break;

            case "document":
            let xmlTag = xhr.response.documentElement.nodeName;
            response = `<${xmlTag}>${xhr.response.documentElement.textContent}</${xmlTag}>`;
            break;

            default:
            break;
        }

        let result_div = document.getElementById("result_div");
        let pre = document.createElement("pre");
        pre.textContent = response;

        if (result_div.children.length > 0) {
            result_div.removeChild(result_div.lastChild);
        }

        result_div.appendChild(pre);
        }
    });

    xhr.addEventListener("error", function (evt) {
        window.alert("Wystąpił problem z żądaniem!");
    });

    xhr.responseType = response_type;
    xhr.withCredentials = true;

    if (http_method === "POST") {
        xhr.open("POST", "http://localhost:8000/teacher/add", true);
    }

    if (http_method === "PUT") {
        xhr.open("PUT", "http://localhost:8000/teacher/modify", true);
    }

    if (http_method === "DELETE") {
        xhr.open("DELETE", "http://localhost:8000/teacher/delete", true);
    }

    switch (response_type) {
        case "json":
        xhr.setRequestHeader("Accept", "application/json");
        break;
        case "document":
        xhr.setRequestHeader("Accept", "application/xml");
        break;
    }

    if (http_method === "POST") {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`args=${encodeURIComponent(JSON.stringify(args))}`);
    }

    if (http_method === "PUT") {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`args=${encodeURIComponent(JSON.stringify(args))}`);
    }

    if (http_method === "DELETE") {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`args=${encodeURIComponent(JSON.stringify(args))}`);
    }
}

function handleDrop(ev) {
    ev.preventDefault();
    const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
    if (["ADD", "MODIFY", "DELETE"].includes(data.op) && ["JSON", "XML"].includes(data.type)) {
        const methodDict = { "ADD": "POST", "MODIFY": "PUT", "DELETE": "DELETE" }; 
        requestAJAX(methodDict[data.op], data.type.toLowerCase(), getArgs(data))
    } else {
        window.alert("Niepoprawny rodzaj operacji lub żądany typ danych!");
    }
}

function handleDragover(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "copy";
}

function handleDragstart(ev) {
    let form = document.getElementById("op_form");

    let student = form.student.value;
    let subject = form.subject.value;
    let grade = form.grade.value;
    let index = form.index.value;
    let op = form.op.value;
    let res_type = form.type.value;

    let data = { student: student, subject: subject, grade: grade, index: index, op: op, type: res_type };

    ev.dataTransfer.setData("text/plain", JSON.stringify(data));
    ev.dataTransfer.effectAllowed = "copy";
}

configureNavBar();
configureSlider();
carousel();
showSlide(slideIndex);
