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
let miniCardIcons
let cnv
let popupScreen = false
let cardForPopup = null
let onImage = false
let arrivingNumber

function calculateGrade(zScore) {
    let result = "  "  // use this as extra spacing

    // S range
    if (zScore > 3.5)
        result = "S+"
    else if (zScore > 3)
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
    font = loadFont('data/meiryo.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')
    table = {
        "S+": [["", "", "", "", "", "", ""], 14, [(18/18)*190, 0, 100]],
        "S ": [["", "", "", "", "", "", ""], 14, [(17/18)*190, 15, 100]],
        "S-": [["", "", "", "", "", "", ""], 14, [(16/18)*190, 30, 100]],
        "A+": [["", "", "", "", "", "", ""], 14, [(15/18)*190, 40, 100]],
        "A ": [["", "", "", "", "", "", ""], 14, [(13.5/18)*190, 50, 100]],
        "A-": [["", "", "", "", "", "", ""], 14, [(12/18)*190, 60, 100]],
        "B+": [["", "", "", "", "", "", ""], 14, [(10.5/18)*190, 70, 100]],
        "B ": [["", "", "", "", "", "", ""], 14, [(9/18)*190, 69, 98]],
        "B-": [["", "", "", "", "", "", ""], 14, [(8/18)*190, 68, 96]],
        "C+": [["", "", "", "", "", "", ""], 14, [(7/18)*190, 66.5, 94]],
        "C ": [["", "", "", "", "", "", ""], 14, [(6/18)*190, 65, 92]],
        "C-": [["", "", "", "", "", "", ""], 14, [(5/18)*190, 65, 90]],
        "D+": [["", "", "", "", "", "", ""], 14, [(4/18)*190, 50, 88]],
        "D ": [["", "", "", "", "", "", ""], 14, [(3/18)*190, 50, 86]],
        "D-": [["", "", "", "", "", "", ""], 14, [(2/18)*190, 50, 84]],
        "E ": [["", "", "", "", "", "", ""], 14, [(1/18)*190, 50, 82]],
        "F ": [["", "", "", "", "", "", ""], 14, [(0/18)*190, 50, 80]],
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
    tableColumnWidth = (1750-tableColumnHeadersWidth)/(tableColumnHeaders.length)
}

function wordWrap(text, targetSize, maxWidth) {
    textSize(targetSize)

    if (textWidth(text) > maxWidth) {
        let words = text.split(" ")
        let currentWords = ""
        let currentIndex = 0
        let remainingWords = words
        for (let word of words) {
            currentWords += word
            if (textWidth(currentWords) > maxWidth) {
                return (
                    text.substring(0, currentIndex - 1) + "\n" +
                    wordWrap(text.substring(currentIndex))
                )
            }
            currentWords += " "
            currentIndex += word.length + 1
        }
    }

    return text
}

function loadedPlayerData(data) {
    print(data["cardData"])

    let groupData = {
        "S+": [[[], [], [], [], [], [], []], 14],
        "S ": [[[], [], [], [], [], [], []], 14],
        "S-": [[[], [], [], [], [], [], []], 14],
        "A+": [[[], [], [], [], [], [], []], 14],
        "A ": [[[], [], [], [], [], [], []], 14],
        "A-": [[[], [], [], [], [], [], []], 14],
        "B+": [[[], [], [], [], [], [], []], 14],
        "B ": [[[], [], [], [], [], [], []], 14],
        "B-": [[[], [], [], [], [], [], []], 14],
        "C+": [[[], [], [], [], [], [], []], 14],
        "C ": [[[], [], [], [], [], [], []], 14],
        "C-": [[[], [], [], [], [], [], []], 14],
        "D+": [[[], [], [], [], [], [], []], 14],
        "D ": [[[], [], [], [], [], [], []], 14],
        "D-": [[[], [], [], [], [], [], []], 14],
        "E ": [[[], [], [], [], [], [], []], 14],
        "F ": [[[], [], [], [], [], [], []], 14],
    }
    let cardNames = Object.keys(data["cardData"])
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

            groupData[grade][0][tableIndex].push(
                [cardName, data["cardData"][cardName]["Rarity"], data["cardData"][cardName]["url"]]
            )

            // figure out how large the block should be
            groupData[grade][1] = max(groupData[grade][1], groupData[grade][0][tableIndex].length*(24) + 4)
            table[grade][1] = groupData[grade][1]

            print("")
        } else {
            print(`No data for ${cardName}`)
            print("")
        }
    }

    print(groupData)

    miniCardIcons = []

    // make the mini card icon list
    let posYAtStartOfGrade = tableColumnHeadersHeight
    for (let grade in groupData) {
        let gradeData = groupData[grade]
        let posX = tableColumnHeadersWidth
        let height = groupData[grade][1]
        let colorGroupedCards = groupData[grade][0]

        for (let cardsInColor of colorGroupedCards) {
            let posY = posYAtStartOfGrade + 2
            for (let card of cardsInColor) {
                let cardIconWidth = tableColumnWidth - 14
                let wrappedCardName = wordWrap(card[0], 18, cardIconWidth)
                let numNewlines = wrappedCardName.split("\n").length - 1
                let additionalHeightTaken = numNewlines*22
                miniCardIcons.push(
                    new MiniCard(wrappedCardName, card[1], posX + 2, posY + 2, tableColumnWidth - 4, 20 + additionalHeightTaken, card[2], grade)
                )

                groupData[grade][1] += additionalHeightTaken
                table[grade][1] += additionalHeightTaken
                height += additionalHeightTaken
                posY += 24 + additionalHeightTaken
            }

            posX += tableColumnWidth
        }

        posYAtStartOfGrade += height
    }

    resizeCanvas(1750, sum(Object.keys(table).map(key => table[key][1])) + tableColumnHeadersHeight + 2)
}

function sum(arr) {
    let total = 0
    for (let num of arr) {
        total += num
    }
    return total
}

function setup() {
    cnv = createCanvas(500, 500)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)
    data = loadJSON("json/all.json", loadedPlayerData)

    miniCardIcons = []

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)
}


function draw() {
    background(0, 0, 0)

    // loading screen?
    if (width === 500) {
        noFill()
        stroke(0, 0, 25)
        strokeWeight(10)
        circle(250, 250, 480)
        textAlign(CENTER, CENTER)
        noStroke()
        textSize(14)
        fill(0, 0, 50)
        text("Loading...", 250, 250)
        if (onImage) {
            textSize(10)
            text("On images", 250, 270)
        }
    }
    else {
        if (!popupScreen) {
            background(0, 0, 30)
            // display top-left cell
            // black rectangle with "HEADERS" on it
            fill(0, 0, 0)
            noStroke()
            rect(1, 2, tableColumnHeadersWidth - 2, tableColumnHeadersHeight - 4)
            textAlign(CENTER, CENTER)
            fill(0, 0, 100)
            textSize(10)
            text("HEADERS", tableColumnHeadersWidth / 2, tableColumnHeadersHeight / 2)
            textSize(14)
            fill(0, 0, 0)

            let posX = tableColumnHeadersWidth

            rectMode(CORNER)
            imageMode(CENTER)

            // display column header images
            for (let columnHeader of tableColumnHeaders) {
                rect(1 + posX, 2, tableColumnWidth - 2, tableColumnHeadersHeight - 4)
                image(columnHeader, posX + tableColumnWidth / 2, tableColumnHeadersHeight / 2)
                posX += tableColumnWidth
            }

            // display row headers and elements
            let posY = tableColumnHeadersHeight
            for (let rowHeader in table) {
                // displaying row header with centered text
                rect(1, 2 + posY, tableColumnHeadersWidth - 2, table[rowHeader][1] - 4)
                stroke(table[rowHeader][2][0], table[rowHeader][2][1], table[rowHeader][2][2])
                strokeWeight(4)
                line(2, posY, 2, table[rowHeader][1] + posY)
                noStroke()
                fill(0, 0, 100)
                textSize(16)
                textAlign(CENTER, CENTER)
                text(rowHeader, tableColumnHeadersWidth / 2, posY + table[rowHeader][1] / 2)
                // switch to corner text
                textAlign(LEFT, TOP)
                textSize(14)
                fill(0, 0, 17)
                posX = tableColumnHeadersWidth
                for (let element of table[rowHeader][0]) {
                    rect(1 + posX, 2 + posY, tableColumnWidth - 2, table[rowHeader][1] - 4)
                    fill(0, 0, 17)
                    posX += tableColumnWidth
                }
                textSize(14)
                fill(0, 0, 0)
                posY += table[rowHeader][1]
            }
            textAlign(LEFT)

            // display all the mini card icons
            for (let miniIcon of miniCardIcons) {
                miniIcon.display()
            }

            // display all the mini card icons
            for (let miniIcon of miniCardIcons) {
                miniIcon.displayHoverImage()
            }
        }

        // make the popup screen
        if (popupScreen) {
            // make a window for the popup screen
            rectMode(CORNER)
            fill(0, 0, 25)
            rect(100, 100, 1300, 800)

            // display the card name. all "\n"s should be " "s
            textAlign(LEFT, TOP)
            textSize(20)
            fill(0, 0, 100)
            text(cardForPopup.cardName.replaceAll("\n", " "), 110, 110)

            // display the image
            image(cardForPopup.hoverImage, 110, 110 + textAscent() + textDescent(), 300,
                (cardForPopup.hoverImage.height)*(300/(cardForPopup.hoverImage.width))) // keep the same scale

            // find the grade and the color for the grade
            let grade = cardForPopup.grade
            let colorForGrade = table[grade][2]

            // display the top part of the rectangle
            stroke(colorForGrade[0], colorForGrade[1], colorForGrade[2])
            strokeWeight(2)
            line(500, 210, 500, 260)
            line(500, 210, 1320, 210)
            line(1320, 210, 1320, 260)

            // display the bottom part of the rectangle
            stroke(0, 0, 50)
            strokeWeight(2)
            line(500, 310, 500, 260)
            line(500, 310, 1320, 310)
            line(1320, 310, 1320, 260)
            noStroke()

            // display the grade and calibre
            fill(colorForGrade[0], colorForGrade[1], colorForGrade[2])
            rect(505, 215, 90, 42)
            fill(0, 0, 50)
            rect(505, 263, 90, 42)
            fill(0, 0, 25)
            textAlign(CENTER, CENTER)
            text(grade, 550, 233)
            text("ALL", 545, 282)

            // display the graphs
            fill(0, 0, 10)
            textSize(15)
            let samplesPerFiftyXPosition = 5000
            let samplesPerFiftyXPositionInterpretation = "5K"
            let samplesPerHundredXPositionInterpretation = "10K"
            let cardData = data["cardData"][cardForPopup.cardName]
            let samples = cardData["# GIH"]
            let winrate = parseFloat(cardData["GIH WR"].substring(0, cardData["GIH" +
            " WR"].length - 1))
            let winrateMean = data["generalStats"]["GIH WR"]["μ"]
            if (samples > 12000) {
                samplesPerFiftyXPosition = 10000
                samplesPerFiftyXPositionInterpretation = "10K"
                samplesPerHundredXPositionInterpretation = "20K"
            } if (samples > 24000) {
                samplesPerFiftyXPosition = 20000
                samplesPerFiftyXPositionInterpretation = "20K"
                samplesPerHundredXPositionInterpretation = "40K"
            } if (samples > 45000) {
                samplesPerFiftyXPosition = 25000
                samplesPerFiftyXPositionInterpretation = "25K"
                samplesPerHundredXPositionInterpretation = "50K"
            } if (samples > 60000) {
                samplesPerFiftyXPosition = 40000
                samplesPerFiftyXPositionInterpretation = "40K"
                samplesPerHundredXPositionInterpretation = "80K"
            } if (samples > 90000) {
                samplesPerFiftyXPosition = 60000
                samplesPerFiftyXPositionInterpretation = "60K"
                samplesPerHundredXPositionInterpretation = "120K"
            } if (samples > 130000) {
                samplesPerFiftyXPosition = 100000
                samplesPerFiftyXPositionInterpretation = "100K"
                samplesPerHundredXPositionInterpretation = "200K"
            }

            text("0", 625, 180)
            text(samplesPerFiftyXPositionInterpretation, 675, 180)
            text(samplesPerHundredXPositionInterpretation, 725, 180)
            text("45%", 775, 180)
            text("50%", 875, 180)
            text("55%", 975, 180)
            text("60%", 1075, 180)
            text("65%", 1175, 180)
            text("70%", 1275, 180)
            stroke(0, 0, 10)
            strokeWeight(1)
            line(625, 190, 625, 400)
            line(675, 190, 675, 400)
            line(725, 190, 725, 400)
            line(775, 190, 775, 400)
            line(875, 190, 875, 400)
            line(975, 190, 975, 400)
            line(1075, 190, 1075, 400)
            line(1175, 190, 1175, 400)
            line(1275, 190, 1275, 400)

            // display card data appropriately
            // display the dot for the samples
            stroke(0, 0, 100)
            strokeWeight(5)

            point(625 + samples/(samplesPerFiftyXPosition/50), 260)

            // display the dot for the GIH WR mean
            // starts at 45, gains 100 x position for every 5 WR added
            let xPositionForWinrate = 775 + (winrate-45)*(100/5)
            let xPositionForWinrateMean = 775 + (winrateMean-45)*(100/5)

            if (arrivingNumber) {
                arrivingNumber.arrive()
                arrivingNumber.update()
            } else {
                arrivingNumber = new ArrivingNumber(3, 15)
                arrivingNumber.target = xPositionForWinrate
                arrivingNumber.pos = xPositionForWinrateMean
            }

            stroke(0, 0, 50)
            strokeWeight(1)
            line(arrivingNumber.pos, 260, xPositionForWinrateMean, 260)

            stroke(0, 0, 100)
            strokeWeight(5)
            point(xPositionForWinrate, 260)

            stroke(0, 0, 75)
            strokeWeight(3)
            point(xPositionForWinrateMean, 260)


            noStroke()
        }
    }

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.showBottom()
}

function mousePressed() {
    if (popupScreen) {
        if (
            (mouseX < 100 &&
            mouseX > 0) ||
            (mouseY < 100 &&
            mouseY > 0) ||
            (mouseX > width - 100 &&
            mouseX < width) ||
            (mouseY > height - 100 &&
            mouseY < height)
        ) {
            popupScreen = false
            cardForPopup = null
            arrivingNumber = null
            resizeCanvas(1750, sum(Object.keys(table).map(key => table[key][1])) + tableColumnHeadersHeight + 2)
        }
            return
    }

    for (let miniIcon of miniCardIcons) {
        if (miniIcon.isHovered()) {
            popupScreen = true
            cardForPopup = miniIcon
            resizeCanvas(1500, 1000)
            print(popupScreen)
        }
    }
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