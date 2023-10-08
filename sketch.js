/**
 *  @author Cody
 *  @date 2023.09.30
 *
 */

let font
let fixedWidthFont
let variableWidthFont
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */

let table /* just for experimenting */
let tableColumnHeaders
let tableColumnHeadersHeight
let tableColumnWidth
let tableColumnHeadersWidth
let data

function calculateGrade(zScore) {
    let result = "F-"  // use this as extra spacing

    // S range
    if (zScore > (2.5 + 2 / 3))
        result = "S "
    else if (zScore > 2.5)
        result = "S-"
    // A range
    else if (zScore > (2.5 - 1 / 3))
        result = "A+"
    else if (zScore > (1.5 + 1 / 3))
        result = "A "
    else if (zScore > 1.5)
        result = "A-"
    // B range
    else if (zScore > (1.5 - 1 / 3))
        result = "B+"
    else if (zScore > (0.5 + 1 / 3))
        result = "B "
    else if (zScore > 0.5)
        result = "B-"
    // C range
    else if (zScore > (0.5 - 1 / 3))
        result = "C+"
    else if (zScore > (-0.5 + 1 / 3))
        result = "C "
    else if (zScore > -0.5)
        result = "C-"
    // D range
    else if (zScore > (-0.5 - 1 / 3))
        result = "D+"
    else if (zScore > (-1.5 + 1 / 3))
        result = "D "
    else if (zScore > -1.5)
        result = "D-"
    // E range
    else if (zScore > -2)
        result = "E "
    // F range
    else
        result = "F "

    return result
}

function preload() {
    font = loadFont('data/consola.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')
    table = {
        "S ": [["", "", "", "", "", "", ""], 14, [(17/17)*190, 75, 80]],
        "S-": [["", "", "", "", "", "", ""], 14, [(16/17)*190, 75, 80]],
        "A+": [["", "", "", "", "", "", ""], 14, [(15/17)*190, 75, 80]],
        "A ": [["", "", "", "", "", "", ""], 14, [(14/17)*190, 75, 80]],
        "A-": [["", "", "", "", "", "", ""], 14, [(13/17)*190, 75, 80]],
        "B+": [["", "", "", "", "", "", ""], 14, [(11/17)*190, 75, 80]],
        "B ": [["", "", "", "", "", "", ""], 14, [(9/17)*190, 75, 80]],
        "B-": [["", "", "", "", "", "", ""], 14, [(8/17)*190, 75, 80]],
        "C+": [["", "", "", "", "", "", ""], 14, [(7/17)*190, 75, 80]],
        "C ": [["", "", "", "", "", "", ""], 14, [(6/17)*190, 65, 80]],
        "C-": [["", "", "", "", "", "", ""], 14, [(5/17)*190, 65, 80]],
        "D+": [["", "", "", "", "", "", ""], 14, [(4/17)*190, 50, 80]],
        "D ": [["", "", "", "", "", "", ""], 14, [(3/17)*190, 50, 80]],
        "D-": [["", "", "", "", "", "", ""], 14, [(2/17)*190, 50, 80]],
        "E ": [["", "", "", "", "", "", ""], 14, [(1/17)*190, 50, 80]],
        "F ": [["", "", "", "", "", "", ""], 14, [(0/17)*190, 50, 80]],
    }
    tableColumnHeadersHeight = 40
    tableColumnHeadersWidth = 40
    tableColumnHeaders = [
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112758273523793/image.png?ex=651eb360&is=651d61e0&hm=831a23d41e7452e0630274aaed65093869b9256cc4b033da31e23e2acdbe075d&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112877949603840/image.png?ex=651eb37d&is=651d61fd&hm=4d18565da1053670066ce18a7ec4c23a6f3432ba9cc995b0df21373c0189ffba&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112935692574770/image.png?ex=651eb38b&is=651d620b&hm=579de7da0e1b9fbeb05f5afbd1a91ecb1221a1f3e0efd27c5648cd7006cd0d30&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112961781157888/image.png?ex=651eb391&is=651d6211&hm=4a6bc55ac68b3c7022a10f906f75898c7958bca646104c0c59243460b80c9070&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112990205935697/image.png?ex=651eb398&is=651d6218&hm=3db33cb8c9ed7541f2fb6d995f1c3b6a1bb95ccb75f062ad298e079d0657bcc4&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159113064193462293/image.png?ex=651eb3a9&is=651d6229&hm=9be9257233b621639107550717f7387a72965679c5853577398e04cfeb98eb2f&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159113092282724432/image.png?ex=651eb3b0&is=651d6230&hm=bc388c75d916ed1aacc60f4951fcab0a2359e762d9db0d2a6be7a2150da1032f&"),
    ]
    tableColumnWidth = (2000-tableColumnHeadersWidth)/(tableColumnHeaders.length)
    data = loadJSON("json/all.json", loadedPlayerData)
}

function loadedPlayerData(data) {
    print(Object.keys(data["cardData"]))
    cardNames = Object.keys(data["cardData"])
    for (let cardName of cardNames) {
        // special no-data handling
        if (data["cardData"][cardName]["zScoreGIH"]) {
            // print data for card
            print(cardName)
            print(calculateGrade(data["cardData"][cardName]["zScoreGIH"]))
            print(data["cardData"][cardName]["zScoreGIH"])

            // figure out which part of the table to put it in
            let grade = calculateGrade(data["cardData"][cardName]["zScoreGIH"])
            let tableIndex = 6 // assume that it's colorless
            let color = data["cardData"][cardName]["Color"]
            if (color === "W")
                tableIndex = 0
            if (color === "U")
                tableIndex = 1
            if (color === "B")
                tableIndex = 2
            if (color === "R")
                tableIndex = 3
            if (color === "G")
                tableIndex = 4
            if (color.length > 1) // multicolor
                tableIndex = 5
            print(tableIndex)
            print(color)

            table[grade][0][tableIndex] += `\n${cardName}`
            if (table[grade][0][tableIndex][0] === "\n") {
                table[grade][0][tableIndex] = table[grade][0][tableIndex].substring(1)
            }

            // find number of newline characters to figure out how large
            // the block should be
            let numNewlines = table[grade][0][tableIndex].split("\n").length - 1
            table[grade][1] = max(table[grade][1], numNewlines*(17.5) + 18)

            print("")
        } else {
            print(`No data for ${cardName}`)
            print("")
        }
    }
}

function setup() {
    let cnv = createCanvas(2000, 1320)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    testMiniCardMythic = new MiniCard("This is a test mythic card", "mythic", 1443, 1100, 273, 16)
    testMiniCardRare = new MiniCard("This is a test rare card", "rare", 1443, 1120, 273, 16)
    testMiniCardUncommon = new MiniCard("This is a test uncommon card", "uncommon", 1443, 1140, 273, 16)
    testMiniCardCommon = new MiniCard("This is a test common card", "common", 1443, 1160, 273, 16)
}


function draw() {
    background(234, 34, 24)

    // display top-left cell
    // black rectangle with "HEADERS" on it
    fill(0, 0, 0)
    noStroke()
    rect(2, 2, tableColumnHeadersWidth - 2, tableColumnHeadersHeight - 2)
    textAlign(CENTER, CENTER)
    fill(0, 0, 100)
    textSize(10)
    text("HEADERS", tableColumnHeadersWidth/2, tableColumnHeadersHeight/2)
    textSize(14)
    fill(0, 0, 0)

    let posX = tableColumnHeadersWidth

    rectMode(CORNER)
    imageMode(CENTER)

    // display column header images
    for (let columnHeader of tableColumnHeaders) {
        rect(2 + posX, 2, tableColumnWidth - 4, tableColumnHeadersHeight - 4)
        image(columnHeader, posX + tableColumnWidth/2, tableColumnHeadersHeight/2)
        posX += tableColumnWidth
    }

    // display row headers and elements
    let posY = tableColumnHeadersHeight
    for (let rowHeader in table) {
        // displaying row header with centered text
        rect(2, 2 + posY, tableColumnWidth - 4, table[rowHeader][1] - 4)
        fill(table[rowHeader][2][0], table[rowHeader][2][1], table[rowHeader][2][2])
        textAlign(CENTER, CENTER)
        text(rowHeader, tableColumnHeadersWidth/2, posY + table[rowHeader][1]/2)
        // switch to corner text
        textAlign(LEFT, TOP)
        textSize(14)
        fill(234, 10, 37)
        posX = tableColumnHeadersWidth
        for (let element of table[rowHeader][0]) {
            rect(2 + posX, 2 + posY, tableColumnWidth - 4, table[rowHeader][1] - 4)
            fill(0, 0, 100)
            text(element, 3 + posX, 3 + posY)
            textSize(14)
            fill(234, 10, 37)
            posX += tableColumnWidth
        }
        textSize(14)
        fill(0, 0, 0)
        posY += table[rowHeader][1]
    }

    testMiniCardMythic.display()
    testMiniCardRare.display()
    testMiniCardUncommon.display()
    testMiniCardCommon.display()

    textAlign(LEFT)

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.showBottom()

    if (frameCount > 3000)
        noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }

    if (key === '`') { /* toggle debug corner visibility */
        debugCorner.visible = !debugCorner.visible
        console.log(`debugCorner visibility set to ${debugCorner.visible}`)
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.visible = false
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    showBottom() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */
            rect(
                0,
                height,
                width,
                DEBUG_Y_OFFSET - LINE_HEIGHT * this.debugMsgList.length - TOP_PADDING
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            for (let index in this.debugMsgList) {
                const msg = this.debugMsgList[index]
                text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
            }
        }
    }

    showTop() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */

            /* offset from top of canvas */
            const DEBUG_Y_OFFSET = textAscent() + TOP_PADDING
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background, a console-like feel */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)

            rect( /* x, y, w, h */
                0,
                0,
                width,
                DEBUG_Y_OFFSET + LINE_HEIGHT*this.debugMsgList.length/*-TOP_PADDING*/
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            textAlign(LEFT)
            for (let i in this.debugMsgList) {
                const msg = this.debugMsgList[i]
                text(msg, LEFT_MARGIN, LINE_HEIGHT*i + DEBUG_Y_OFFSET)
            }
        }
    }
}