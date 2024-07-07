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
    var canvas = document.getElementById('canvas');     // Tutaj jest użyty standard W3C DOM — będzie on tematem następnych ćwiczeń
    const ctx = canvas.getContext('2d');                // Utworzenie obiektu 'CanvasRenderingContext2D'       

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
