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
