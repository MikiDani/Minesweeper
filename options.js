
let firstX=sessionStorage.getItem("firstX");
let firstY=sessionStorage.getItem("firstY");
let firstMines=sessionStorage.getItem("firstMines");
let firstHelp=sessionStorage.getItem("firstHelp");
let soundSwitch=sessionStorage.getItem("soundSwitch");
let gameOver=false;
soundSwitch=="true" ? soundSwitch=true : soundSwitch=false;

document.querySelector('input[name="tablex"]').value=firstX;
document.querySelector('input[name="tabley"]').value=firstY;
document.querySelector('input[name="firstmines"]').value=firstMines;

helpInputs = document.querySelectorAll(".form-check-input");
for (let list of helpInputs) { list.removeAttribute('checked'); }

if (firstX==null) { firstX="15"; }
if (firstY==null) { firstY="15"; }
if (firstMines==null) { firstMines="40"; }
if (firstHelp==null) { firstHelp="2"; }
if (soundSwitch==null) { soundSwitch=true; }

document.getElementById("radio"+firstHelp).setAttribute('checked', true);
document.querySelector('input[name="helpradio"]').value=firstHelp;
document.getElementById("windiv").style.display="none";

class Time {
    timeStart;
    time;
    constructor() {
        this.timeStart = false;
        this.time = { "hours": 0,"minutes": 0, "seconds": 0, "milliseconds": -1, "epoch": 0 };
    }

    myTimer = () => {
        if (this.time.hours<12) { 
            this.time.milliseconds++
            this.time.epoch++
        }
        
        if (this.time.milliseconds==250) { this.time.milliseconds=0; this.time.seconds++; }
        if (this.time.seconds==60) { this.time.seconds=0; this.time.minutes++; }
        if (this.time.minutes==60) { this.time.minutes=0; this.time.hours++; }
        
        let timeDraw="";
        if (this.time.hours > 0 ) { timeDraw+=this.time.hours+":"; }
        if(this.time.minutes<10) { timeDraw+="0"; };
        timeDraw+=this.time.minutes+":";
        if(this.time.seconds<10) { timeDraw+="0"; };
        timeDraw+=this.time.seconds;
        //timeDraw+="."+this.time.milliseconds;
        return timeDraw;
    }

    printScreen = () => {
        let print = "";
        this.time.hours>0 ? print+=this.time.hours+":" :  print; ;
        this.time.minutes>0 ? print+=this.time.minutes+":" :  print; ;
        print+=this.time.seconds+".";
        if (this.time.milliseconds.length<2) {  print+="00"; } else if (this.time.milliseconds.length<3) {  print+="0"; }
        print+=this.time.milliseconds;
        return print;
    }
}

class Table {
    tableY;
    tableX;
    bombs;
    tableData;
    constructor (tableY, tableX, bombs) {
        this.tableY=tableY;
        this.tableX=tableX;
        this.bombs=bombs;
        this.tableData=[];
        this.tableGenerate();
        this.insertBombInTable();
    }

    tableGenerate = () => {
        this.tableData=[];
        for (let y=0; y<this.tableY; y++) {
            for (let x=0; x<this.tableX; x++) {
                this.tableData.push('0');
            }
        }
    }

    insertBombInTable = () => {
        for (let n=0; n<this.bombs; n++) {
            let repeat=true;
            do {
                let randomY=Math.floor(Math.random() * this.tableY);
                let randomX=Math.floor(Math.random() * this.tableX);
                let upper=0;
                for (let y=0; y<this.tableY; y++) {
                    for (let x=0; x<this.tableX; x++) {
                        if (randomY==y && randomX==x) {
                            if (this.tableData[upper]=="0") {
                                this.tableData[upper]='B';
                                repeat=false;
                            }
                        }
                        upper++;
                    }
                }
            } while (repeat);
        }
    }

    tableRemovePictures = () => {
        for (let id=0; id<this.tableData.length; id++) {
            document.getElementById(id).style.backgroundImage="none";
        }
    }

    removePicture = (id) => {
        document.getElementById(id).style.backgroundImage="none";
    }

    texturizer ({divId, pic, color}) {
        if (typeof pic !== 'undefined') { 
            document.getElementById(divId).style.backgroundImage="url('img/"+pic+".svg')";
        }
        if (typeof color !== 'undefined') {
            document.getElementById(divId).style.backgroundColor = color;
        }
    }

    oneDraw (divId) {
        if (this.tableData[divId]=="B") { this.texturizer({divId:divId, pic:"bomb", color:"#f3e0b4"}); }
        if (this.tableData[divId]=="E") { this.texturizer({divId:divId, pic:"bomb", color:"#f00"}); }
        if (this.tableData[divId]=="F") { this.texturizer({divId:divId, pic:"flag", color:"#fab27b"}); }
        if (this.tableData[divId]=="FOK") { this.texturizer({divId:divId, pic:"flagok", color:"#14256"}); }
        if (this.tableData[divId]=="FNO") { this.texturizer({divId:divId, pic:"flagx", color:"#14256"}); }
        if (this.tableData[divId]=="V") { this.texturizer({divId:divId, color:"#fff"}); }
        if (this.tableData[divId]=="0") { this.texturizer({divId:divId, pic:"warp", color:"#aaa"}); }
        if (this.tableData[divId]=="1") { this.texturizer({divId:divId, pic:"num1", color:"#fff"}); }
        if (this.tableData[divId]=="2") { this.texturizer({divId:divId, pic:"num2", color:"#fff"}); }
        if (this.tableData[divId]=="3") { this.texturizer({divId:divId, pic:"num3", color:"#fff"}); }
        if (this.tableData[divId]=="4") { this.texturizer({divId:divId, pic:"num4", color:"#fff"}); }
        if (this.tableData[divId]=="5") { this.texturizer({divId:divId, pic:"num5", color:"#fff"}); }
        if (this.tableData[divId]=="6") { this.texturizer({divId:divId, pic:"num6", color:"#fff"}); }
        if (this.tableData[divId]=="7") { this.texturizer({divId:divId, pic:"num7", color:"#fff"}); }
        if (this.tableData[divId]=="8") { this.texturizer({divId:divId, pic:"num8", color:"#fff"}); }
    }

    tableDraw () {
        for (let n=0; n<this.tableData.length; n++) {
            this.oneDraw(n);
        }
    }

    onlyTypeDraw (type) {
        for (let n=0; n<this.tableData.length; n++) {
            if (this.tableData[n]==type) { this.oneDraw(n); }
        }
    }

    wrongFlags () {
        for (let n=0; n<this.tableData.length; n++) {
            if (this.tableData[n]=="F") {
                if (bombTable.tableData[n]=="B") {
                    this.tableData[n]="FOK";
                    this.oneDraw(n);
                } else {
                    this.tableData[n]="FNO";
                    this.oneDraw(n);
                }
            }
        }
    }

    YXConvertToId = (Y, X) => {
        let idUpper=0;
        for (let y=0; y<this.tableY; y++) {
            for (let x=0; x<this.tableX; x++) {
                if (y==Y && x==X) {
                    return idUpper;
                }
                idUpper++;
            }
        }
    }

    idConvertToYX = (boxId) => {
        let idUpper=0;
        for (let y=0; y<this.tableY; y++) {
            for (let x=0; x<this.tableX; x++) {
                if (boxId==idUpper) { return [y, x]; }
                idUpper++;
            }
        }
    }

    howManyBombs = (boxId) => {
        let searchEight = [
            {y:-1,x:-1}, {y:-1,x:0}, {y:-1,x:1},
            {y:0,x:-1}, {y:0,x:1},        
            {y:1,x:-1}, {y:1,x:0}, {y:1,x:1},
        ];
        let BoxIdY = this.idConvertToYX(boxId)[0];
        let BoxIdX = this.idConvertToYX(boxId)[1];
        let bombHave=0;
        for (let n=0; n<searchEight.length; n++) {
            let sY = BoxIdY + searchEight[n].y;
            let sX = BoxIdX + searchEight[n].x; 
            if (sY>=0 && sY<this.tableY && sX>=0 && sX<this.tableX) {
                if (bombTable.tableData[this.YXConvertToId(sY, sX)]=="B") { bombHave++; }
            }
        }
        return(bombHave);
    }
}

class SmailyClass {
    SmailyDiv;
    constructor () {
        this.smailyDiv=document.getElementById('smiley');
        this.smailyDiv.addEventListener('click', () => {
            restart();
        });
    }
    smileySuprased = () => {
        if (gameOver==false) { this.smailyDiv.style.backgroundImage="url('img/smileysuprised.svg')"; }
    }
    smileySad = () => {
        if (gameOver==false) { this.smailyDiv.style.backgroundImage="url('img/smileysad.svg')"; }
    }
    smileyHappy = () => {
        if (gameOver==false) { this.smailyDiv.style.backgroundImage="url('img/smileyhappy.svg')"; }
    }
    smileyWin = () => {
        if (gameOver==false) { this.smailyDiv.style.backgroundImage="url('img/smileywin.svg')"; }
    }
}

const gameTable = new Table(firstX, firstY, 0);
const bombTable = new Table(firstX, firstY, firstMines);
const gamerFlagsTable = new Table(firstX, firstY, 0);
const gameTime = new Time();
const smiley = new SmailyClass();

tableCursorDefault =() => {
    for (let divList in gameTable.tableData) { document.getElementById(divList).style.cursor = "default"; }
}

// Creat gameTable DIV-s
let upper = 0;
for (let y = 0; y < gameTable.tableY; y++) {
    for (let x = 0; x < gameTable.tableX; x++) {
        const boxDivCreate = document.createElement("div");
        boxDivCreate.setAttribute("class", "box text-white");
        boxDivCreate.setAttribute("id", upper);
        document.getElementById("gametable").appendChild(boxDivCreate);
        upper++;
    }
}

// game window resize
const newBoxSize = (tableX, tableY) => {
    let domino="";
    for (let m=0; m<tableX; m++) {
      domino=domino+"1fr "
    }
    document.querySelector('.gametable').style.gridTemplateColumns=domino;
    let newBoxHeight=document.getElementById('0').offsetWidth;
    for (let n=0; n<(tableX * tableY); n++) {
      document.getElementById(n).style.height = newBoxHeight+'px';
    }
}

// first sizeing gametable
setTimeout(() => { newBoxSize(gameTable.tableX, gameTable.tableY) }, 1);
window.onresize = () => newBoxSize(gameTable.tableX, gameTable.tableY);

// Options inputs
let inputArray = document.getElementsByTagName('input');
let tableY = document.querySelector('#tableY input');
let tableX = document.querySelector('#tableX input');
let mines = document.querySelector('#mines input');
let generateButton = document.getElementById('generate-button');
let helpButton = document.getElementById('help-button');
let soundSwitchButton = document.getElementById('sound-switch');

soundSwitchButton.onclick = () => {
    if (soundSwitch==false) {
        soundSwitch=true;
        playAudio("click3");
    } else {
        soundSwitch=false;
    }
    soundSwitchButtonDraw();
}

soundSwitchButtonDraw = () => {
    if (soundSwitch==true) { soundSwitchButton.src="img/soundon.svg"; }
    else { soundSwitchButton.src="img/soundoff.svg"; }
}

soundSwitchButtonDraw();

for (let n=0; n<4; n++) {
    document.getElementById('radio'+n).onclick= () => { document.querySelector('input[name="helpradio"]').value=n; }    
}

function newValue(boxId) {
    document.querySelector('#'+boxId+' .indicator').innerHTML =
    document.querySelector('#'+boxId+' input').value;
    return document.querySelector('#'+boxId+' input').value;
}

function setValue() {
    valueTableX=newValue('tableX');
    valueTableY=newValue('tableY');
    valueMines=newValue('mines');
    document.querySelector('#mines input').max=Math.ceil(((valueTableX*valueTableY)/2));
}

// first load options
setValue();

for(var loadInput of inputArray) { loadInput.oninput = setValue; }

generateButton.onclick = () => { restart(); }

helpButton.onclick = () => {
    if (gameOver==false && gameHelps>0) {
        if (gameTime.timeStart==false) { gameTime.timeStart=true; }
        bombTable.onlyTypeDraw("B");
        gameHelps=gameHelps-1;
        helpButtonDraw();
        setTimeout(() => {
            gameTable.tableRemovePictures();
            gameTable.tableDraw();
            gamerFlagsTable.onlyTypeDraw("F");
        }, 2000);
    }
}

helpButtonDraw = () => {
    if (gameHelps==0) {
        helpButton.innerHTML=`<img src="img/flagx.svg" width="25">`;
    } else {
        helpButton.innerHTML=`<img src="img/num${gameHelps}.svg" width="25">`;
    }
}

function restart () {
    playAudio("click3");
    
    setTimeout(() => {
        let valueHelp=document.querySelector('input[name="helpradio"]').value;
        sessionStorage.setItem("firstX", valueTableX);
        sessionStorage.setItem("firstY", valueTableY);
        sessionStorage.setItem("firstMines", valueMines);
        sessionStorage.setItem("firstHelp", valueHelp);
        sessionStorage.setItem("soundSwitch", soundSwitch);
    
        location.reload();
    }, 300)
}

// Time
function printClock() { document.querySelector(".time-text").innerHTML = gameTime.myTimer(); }
setInterval(() => {
    if (gameOver == false && gameTime.timeStart == true) { printClock(); }
}, 1);

function printBombText() { document.querySelector(".bomb-text").innerHTML = playerFlags + "/" + bombTable.bombs; }

// addEventListeners
document.body.onmousedown = () => { smiley.smileySuprased(); }
document.body.onmouseup = () => { smiley.smileyHappy(); }

for (let boxId = 0; boxId < gameTable.tableData.length; boxId++) {
    // click
    document.getElementById(boxId).addEventListener("click", () => {
        if (gameTime.timeStart == false) { gameTime.timeStart = true; }
        searchEngine(boxId); // ENGINE
        seeTableWin();
    });

    // add bomb flag
    document.getElementById(boxId).addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (gameOver == false) {
            if (gameTime.timeStart == false) { gameTime.timeStart = true; }
            if (gameTable.tableData[boxId] == "0") {
                playAudio("click");
                if (gamerFlagsTable.tableData[boxId] == "F") {
                    gamerFlagsTable.tableData[boxId] = "0";
                    playerFlags--;
                    printBombText();
                } else {
                    if (playerFlags < bombTable.bombs) {
                        gamerFlagsTable.tableData[boxId] = "F";
                        playerFlags++;
                        printBombText();
                    }
                }
                gamerFlagsTable.removePicture(boxId);
                gamerFlagsTable.oneDraw(boxId);
                seeTableWin();
            }
        }
    })
}

function seeTableWin() {
    if (gameOver==false) {
        let boxNull=0;
        for (let n=0; n<gameTable.tableData.length; n++) { gameTable.tableData[n]==0 ? boxNull++ : boxNull; }
        if (boxNull==bombTable.bombs && playerFlags==bombTable.bombs) {
            playAudio("win");
            tableCursorDefault();
            smiley.smileyWin();
            gameOver=true;
            gameWin=true;

            document.getElementById("wintext").innerHTML=`Your time: ${gameTime.printScreen()}`; 
            document.getElementById("windiv").style.display="block";

            makehiddeninput ("time", gameTime.printScreen());
            makehiddeninput ("table", `${gameTable.tableX} x ${gameTable.tableY}`);
            makehiddeninput ("bomb", bombTable.bombs);
        }
    }
}

function makehiddeninput ($name, $value) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", $name);
    input.setAttribute("value", $value);
    document.getElementById("windiv").appendChild(input);
}

function soundLoad() {
    let audioElements = [ 
        { id: "click", src: "sound/click.mp3" },
        { id: "click2", src: "sound/click2.mp3" },
        { id: "click3", src: "sound/click3.mp3" },
        { id: "win", src: "sound/win.mp3" },
        { id: "boom", src: "sound/boom.mp3" },
    ];

    for (let attribute of audioElements) {
        let audio = document.createElement('audio');
        for (let key in attribute) {
            audio.setAttribute(key, attribute[key]);
        }
        document.getElementById("audios").appendChild(audio);
    }
}

function playAudio (soundname) {
    if (soundSwitch==true) {
        document.getElementById(soundname).play();
    }
}