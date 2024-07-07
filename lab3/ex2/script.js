var setButton = document.querySelector('#set_button');
var deleteButton = document.querySelector('#delete_button');
var addButton = document.querySelector('#add_button');

//set of elements to refer to in handling functions
let body = document.body;
let header = document.querySelector('header');
let h1 = document.querySelectorAll('h1');
let div = document.querySelector('div');
let nav = document.querySelector('nav');
let aside = document.querySelector('aside');
let h2 = document.querySelectorAll('h2');
let main = document.querySelector('main');
let footer = document.querySelector('footer');
let blockquote = document.querySelector('blockquote');

var styleSet = true; //so that style can be turned off at the start
var activeParagraphs = 0; //initially there are 0 paragraphs shown
const paragraphs = [ //all paragraphs possibly to be shown
    //first paragraph
    ["Natenczas Wojski chwycił na taśmie przypięty",
    "Swój róg bawoli, długi, cętkowany, kręty",
    "Jak wąż boa, oburącz do ust go przycisnął,", 
    "Wzdął policzki jak banię, w oczach krwią zabłysnął,",
    "Zasunął wpół powieki, wciągnął w głąb pół brzucha", 
    "I do płuc wysłał z niego cały zapas ducha,",
    "I zagrał: róg jak wicher, wirowatym dechem", 
    "Niesie w puszczę muzykę i podwaja echem."],
    
    //second paragraph
    ["Umilkli strzelcy, stali szczwacze zadziwieni",
    "Mocą, czystością, dziwną harmoniją pieni.",
    "Starzec cały kunszt, którym niegdyś w lasach słynął,",
    "Jeszcze raz przed uszami myśliwców rozwinął;",
    "Napełnił wnet, ożywił knieje i dąbrowy,", 
    "Jakby psiarnię w nie wpuścił i rozpoczął łowy."],

    //third paragraph
    ["Bo w graniu była łowów historyja krótka:",
    "Zrazu odzew dźwięczący, rześki: to pobudka;", 
    "Potem jęki po jękach skomlą: to psów granie;",
    "A gdzieniegdzie ton twardszy jak grzmot: to strzelanie."]
]

setButton.addEventListener("click", setStyle);
deleteButton.addEventListener("click", deleteStyle);
addButton.addEventListener("click", addParagraph);
init();

function setStyle() {
    if (styleSet === false) {
        styleSet = true;

        //adding classes to all elements
        header.classList.add('azure');
        header.classList.add('element');

        div.classList.add('contents');

        nav.classList.add('azure');
        nav.classList.add('element');

        aside.classList.add('azure');
        aside.classList.add('element');

        main.classList.add('azure');
        main.classList.add('element');

        footer.classList.add('azure');
        footer.classList.add('element');

        //adding individual styles
        aside.style.width = '750px';
        aside.style.marginLeft = 'auto';
        aside.style.fontSize = ''; //so that class takes effect

        body.style.width = '1460px';

        footer.style.padding = '8px';
        footer.style.marginLeft = '25px';
        footer.style.fontSize = ''; //so that class takes effect

        for (let heading of h1) {
            heading.style.margin = '8px';
            heading.style.fontSize = '52px';
        }

        for (let heading of h2) {
            heading.style.margin = '8px';
            heading.style.fontSize = '44px';
        }

        header.style.marginLeft = '25px';

        main.style.width = '550px';
        main.style.height = '464.8px';
        main.style.paddingBottom = '20px';
        main.style.marginLeft = '25px';

        blockquote.style.fontSize = '16px';
        blockquote.style.marginLeft = '8px';
        blockquote.style.marginRight = '8px';

        nav.style.width = '180px';
        nav.style.marginLeft = '25px';
        nav.style.fontSize = ''; //so that class takes effect
    }
}

function deleteStyle() {
    if (styleSet) {
        styleSet = false;

        //removing classes from all elements
        header.classList.remove('azure');
        header.classList.remove('element');

        div.classList.remove('contents');

        nav.classList.remove('azure');
        nav.classList.remove('element');

        aside.classList.remove('azure');
        aside.classList.remove('element');

        main.classList.remove('azure');
        main.classList.remove('element');

        footer.classList.remove('azure');
        footer.classList.remove('element');

        //removing individual styles
        aside.style.width = '';
        aside.style.marginLeft = '';
        aside.style.fontSize = '18px'; //so that it looks like on the screen
        
        body.style.width = '1000px';
        
        footer.style.padding = '';
        footer.style.marginLeft = '';
        footer.style.fontSize = '18px'; //so that it looks like on the screen
        
        for (let heading of h1) {
            heading.style.margin = '';
            heading.style.fontSize = '';
        }
        
        for (let heading of h2) {
            heading.style.margin = '';
            heading.style.fontSize = '';
        }
        
        header.style.marginLeft = '';
        
        main.style.width = '';
        main.style.height = '';
        main.style.paddingBottom = '';
        main.style.marginLeft = '';
        
        //so that it looks like on the screen
        blockquote.style.fontSize = '14px';
        blockquote.style.marginLeft = '0';
        blockquote.style.marginRight = '0';
        
        nav.style.width = '';
        nav.style.marginLeft = '';
        nav.style.fontSize = '18px'; //so that it looks like on the screen
    }
}

function addParagraph() {
    if (activeParagraphs < paragraphs.length) {
        let currentParagraph = paragraphs[activeParagraphs];
        let fragment = document.createDocumentFragment();
        let textNode, brNode;
        
        for (let i = 0; i < currentParagraph.length; i++) {
            textNode = document.createTextNode(currentParagraph[i]);
            fragment.appendChild(textNode);

            brNode = document.createElement('br');
            fragment.appendChild(brNode);
        }
        
        let addedParagraph = document.createElement('p');
        addedParagraph.appendChild(fragment);
        blockquote.appendChild(addedParagraph);
        activeParagraphs += 1;

        if (activeParagraphs === paragraphs.length) {
            addButton.removeEventListener("click", addParagraph);
            addButton.disabled = true;
        }
    }
}

function init() {
    blockquote.style.fontFamily = 'Courier'; //so that it looks like on the screen
    footer.style.marginBottom = '25px'; //so that it looks like on the screen

    deleteStyle(); //initial style settings: no style
}
