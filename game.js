// Game
let gameWin = false;
let playerFlags = 0;
let gameBombs = bombTable.bombs;
let gameHelps = firstHelp;

soundLoad();
gameTable.tableDraw();
smiley.smileyHappy();
helpButtonDraw();
printClock();
printBombText();
soundSwitchButtonDraw();

searchEngine = (boxId) => {
    if (gameOver == false && gameTable.tableData[boxId] == "0" && gamerFlagsTable.tableData[boxId] == 0) {
        playAudio("click2");
        if (bombTable.tableData[boxId] == "B") {
            // GAME OVER
            playAudio("boom");
            bombTable.onlyTypeDraw("B");
            gameTable.tableData[boxId] = "E";
            gameTable.oneDraw(boxId);
            gamerFlagsTable.wrongFlags();
            smiley.smileySad();
            gameOver = true;
            tableCursorDefault();
        } else {
            // SEE bombs in clickbox
            let reBombs = bombTable.howManyBombs(boxId);
            if (reBombs == "0") {
                gameTable.tableData[boxId] = "V";
                gameTable.removePicture(boxId);
                gameTable.oneDraw(boxId);
                let nullSearch = [
                    { y: -1, x: -1 }, { y: -1, x: 0 }, { y: -1, x: 1 },
                    { y: 0, x: -1 }, { y: 0, x: 1 },
                    { y: 1, x: -1 }, { y: 1, x: 0 }, { y: 1, x: 1 },
                ];               
                boxIdCordY=gameTable.idConvertToYX(boxId)[0];
                boxIdCordX=gameTable.idConvertToYX(boxId)[1];
                let nullSearchID=[];
                nullSearchID.push({"y": boxIdCordY, "x": boxIdCordX}) // FIRST CHECK
                do {
                    for (let IdList of Object.values(nullSearchID)) {
                        let forBoxIdCordY=IdList.y;
                        let forBoxIdCordX=IdList.x;
                        //beside 8box see in circle
                        for (let oList of Object.values(nullSearch)) {
                            let seeCordY=(forBoxIdCordY+oList.y); let seeCordX=(forBoxIdCordX+oList.x);
                            if (seeCordY>=0 && seeCordY<gameTable.tableY && seeCordX>=0 && seeCordX<gameTable.tableX) {
                                seeCordId=gameTable.YXConvertToId(seeCordY, seeCordX);
                                if (gameTable.tableData[seeCordId]==0) {
                                    let cordBombs = bombTable.howManyBombs(seeCordId);
                                    if (cordBombs>0) {
                                        gameTable.tableData[seeCordId] = cordBombs;
                                        gameTable.oneDraw(seeCordId);
                                    }
                                    if (cordBombs==0) {
                                        gameTable.tableData[seeCordId] = "V";
                                        gameTable.removePicture(seeCordId);
                                        gameTable.oneDraw(seeCordId);
                                        nullSearchID.push({"y":seeCordY,"x":seeCordX});
                                    }
                                }
                            }
                        }
                        nullSearchID.shift();
                    }
                } while (nullSearchID.length != 0);
            } else {
                gameTable.tableData[boxId] = reBombs;
                gameTable.oneDraw(boxId);
            }
        }
    }
}