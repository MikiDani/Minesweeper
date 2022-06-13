let upper = 0;
for (let y = 0; y < gameTable.tableY; y++) {
    for (let x = 0; x < gameTable.tableX; x++) {
        document.write("<div id="+upper+" class='box text-white'></div>");
        upper++;
    }
}